import { AsyncStorage } from 'react-native';
import WebRTC from 'react-native-webrtc';
var {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia,
} = WebRTC;

import { actions } from '../reducers';

import IPCortexConfig from '../config/ipcortex';

// This module was initially conceived to pull the API from the target
// PBX environment and cache a static instance within this module closure
// rather than poluting the global object. This took a bunch of hacks
// and then we found we needed loads of mods anyway so started keepng a local
// copy.
//
// true = use local module copies of ipcortex-api and JsSIP and plop them in
//        the global namespace
// false = load from the PBX and hide them in this module
const localAPIBuild = true;
// Remove next three lines if localAPIBuild === false
global.chrome = {storage: AsyncStorage}
import expJsSIP from 'jssip';
import expIPCortex from 'ipcortex-api';

if(localAPIBuild) {

    global.window.localStorage = global.localStorage = AsyncStorage;
    Object.assign(global.window, WebRTC);
    global.window.mediaDevices = global.window.navigator.mediaDevices = { getUserMedia };
    Object.assign(global.window.navigator, WebRTC);

    global.JsSIP = expJsSIP;
    global.IPCortex = expIPCortex;

    global.Utils = JsSIP.Utils;

    // React Native XMLHttpRequest shim does not like being reused!
    IPCortex.PBX.httpStopReuse();

}
// We use this variable within the module closure to provide a single load
// of the API state for effciency.
var state = { WebRTC, IPCortex: global.IPCortex, PBX: global.IPCortex.PBX, Auth: {}, JsSIP: global.JsSIP };

/**
 * Class to load IPCortex API dynamically in a React [Native] environment
 * Uses the Fetch API.
 */
class IPCortexAPI {

    /**
     * New instance of the IPCortex PBX API. May posess a valid, useable
     * API under the .PBX property from the get go if singleInstance = true (default)
     * AND someone has called serServer before on a valid hostname. If not then caller
     * will need to do this.
     *
     * @method constructor
     * @param  {Boolean}   [singleInstance=true] Unless set to false then only one
     * instance of the API will be mounted globally for all instantitaions. This
     * behaviour is usually what is needed unless instaces are used against different
     * PBXs or different users
     */
    constructor(singleInstance = true, store, Provider) {
        // By default we use one instance of the API for all
        //  instantiations of this class, as this is what we mostly want.
        if(singleInstance)
            Object.assign(this, state);
        if(store != null && Provider != null){
            Object.assign(state, {store, Provider});
            Object.assign(this, {store, Provider});
        }
    }

    startFeed() {

    }

    /**
     * User login to an instance of the API. Async, returns immediately with Promise and caller
       * need not care too much as ultimately dispatches a 'Login' or 'loginError' state change
     * action on the UI.
     *
     * @method doLogin
     * @param  {Object} credentials eiher {username: 'username', password: 'password' }, or {token:}
     *
     */
    async doLogin(credentials, target) {
        try {
            await this.setServer(target, credentials.username)

            await this.IPCortex.PBX.Auth.login(Object.assign({
                notoken: false,
                nodom: true,
                application: 'longLogin',
                tokenCB: (token) => this.store.dispatch(actions.setLoginToken.token(Object.keys(token)))
            }, credentials));
            await this.IPCortex.PBX.startFeed({
                device: true
            });
            return "OK";

        } catch(err) {
            this.store.dispatch(actions.loginError.message(err.toString()));
            throw "login fail";
        }
    }

    patch(module, text) {
        const Patches = [
            { module: 'IPCortex', from: 'var _canReuse = true;', to: 'var _canReuse = false;' },
            { module: 'IPCortex', from: "/* JsSIP.debug.enable('*'); */", to: 'JsSIP.debug.enable("*");' },
            { module: 'IPCortex', from: 'IPCortex.PBX.Auth.rtcReset(', to: 'Auth.rtcReset(' },
            {
                module: 'IPCortex',
                from: /mediaConstraints: \{/g,
                to: 'mediaType: { audio: true, video: false }, ' +
                    'rtcOfferConstraints: { mandatory: {OfferToReceiveVideo:false} },' +
                    'mediaConstraints: {'
            }
        ];
        var res = text;
        Patches.forEach((patch) => {
            if(patch.module == module)
                res = res.replace(patch.from, patch.to)
        });
        return(res);

    }
    /**
     * Load the API from a specific PBX
     *
     * @method loadAPI
     * @param  {string}  hostname PBX hostname
     * @return {Promise}
     */
    async loadAPI(hostname) {
        this.PBX = null;
        this.hostname = host = hostname;
        this.server = server = `https://${hostname}`
        try {
            // If we had an API, invalidate it now
            if(!localAPIBuild) {
                let filesNeeded = [ // { import:'adapter', file: '/cinclude/adapter.js'},
                    { import: 'JsSIP', file: '/cinclude/api/jssip/jssip.js' },
                    { import: 'IPCortex', file: '/api/api.js' }
                ];
                var code = [];

                // This is more serialised than it needs to be but KIS for now
                for(let file of filesNeeded) {
                    let response = await fetch(`${this.server}${file.file}`);
                    if(response.status == 200) {
                        // get the api.js sourcecode text
                        file.code = await response.text();
                    } else {
                        throw `could not load ${this.server}${file.file} from ${hostname}`;
                    }
                }

                // The API is loaded as an anonymous function which tests for node
                // module style module.exports and attaches it's payload as a property
                // if it exists as an alternative to creating an IPCortex.PBX global
                // Also throw the WebRTC entrypoints in as params.
                let exports = {};
                let module = { exports };
                let window = Object.assign({}, WebRTC, { navigator: WebRTC })
                window.mediaDevices = window.navigator.mediaDevices = { getUserMedia };
                Object.assign(window.navigator, WebRTC);
                Object.assign(window, WebRTC);
                // Causes JsSIP debug to throw fewer exceptions
                window.localStorage = { removeItem: () => console.log('removeItem called') };

                let execParams = Object.assign({ hostname }, { module, exports, global, window }, window, state, console);
                // We fool this by executing it in a function with module, exports & WebRTC APIs as params
                filesNeeded.forEach((file) => {
                    text = this.patch(file.import, file.code)
                    let api = Function(`{ ${Object.keys(execParams).toString()} }`, text);
                    try {
                        api(execParams);
                    } catch(err) {
                        console.log(err);
                    }
                    // copy exports into State
                    Object.assign(state, {
                        [file.import]: module.exports
                    })
                    // copy exports into the environment of the next module
                    Object.assign(execParams, state);
                })
                Object.assign(state, { Auth: state.IPCortex.PBX.Auth, PBX: state.IPCortex.PBX });

            } else {
                // Presence or absence of keevioWebSocket in global scope is 'magic' way API
                // knows whether it should be in mobile mode or not (sigh).
                state.keevioWebSocket = global.keevioWebSocket = WebSocket;
                state.IPCortex = global.IPCortex = global.window.IPCortex
                state.JsSIP = global.JsSIP;
                // Purely to make IPCortexAPI.IPCortex.PBX.blah contract to something less obviously
                //  unpleasant
                state.PBX = state.IPCortex.PBX;
            }
            //Object.assign(state.Auth, state.PBX.Auth);
            // Also stash the created API plus the WebRTC object it references in this instance
            Object.assign(this, state);
            if(this.isLoaded) {
                // Got a PBX obj, resolve to the hostname
                console.log(`API loaded from ${hostname}`);
                this.store.dispatch(actions.validateTarget);
                return hostname;
            } else {
                this.store.dispatch(actions.inValidateTarget);
                throw `loaded PBX but typeof PBX is ${typeof PBX}`;
            }

        } catch(error) {
          console.info(`API error ${errro.toString()}`);
            this.store.dispatch(actions.inValidateTarget);
            throw `${error.toString()} reading from ${hostname}`
        }
    }

    /**
     * This is a bit of trickery to prime the proxy server with some state that tells
     *  it which real server we want to connect to. We do nothing with the result, but
     *  it pushes a cookie back which it will use to direct future requests.
     *
     * @method setServer
     * @param  {[type]}  server                 Server name
     * @param  {String}  [username='anonymous'] Username if we know it
     * @return {Promise}                        Resolves when server has been set
     */
    async setServer(server, username = 'anonymous') {
        let response = await fetch(`${IPCortexConfig.proxy}/server/set/${username}/${server}`, {credentials: 'same-origin'});
        console.debug('got headers', response.headers);
        if(response.status == 200) {
            let body = await response.text();
            this.haveSetServer = true;
            if (state.tokenToSend){
                console.log(`NOW sending paused token ${state.tokenToSend}`);
                await this.sendNotificationToken(state.tokenToSend);
                delete state.tokenToSend;
            }
            this.PBX.Auth.setHost(IPCortexConfig.proxy);
        } else {
            throw `could not set server ${hostname} at proxy ${IPCortexConfig.proxy}`;
        }


    }

    /**
     * Send notification token to server, will defer this until we have setServer
     * if we get the token too early.
     *
     * @method sendNotificationToken
     * @param  {token}              token opaque thing that means something to the server
     * @return {Promise}                  resolves when request is complete
     */
    async sendNotificationToken(token) {
        console.log('sendNotificationToken', token);
        if(token == null)
            return;
        if(this.haveSetServer) {
            let response = await fetch(`${IPCortexConfig.proxy}/server/token/${token.os}/${token.token}`, {credentials: 'same-origin'});
            if(response.status == 200) {
                let body = await response.text();
            } else {
                // try again later perhaps
                state.tokenToSend = token;
                throw `could not set token at proxy ${IPCortexConfig.proxy}`;
            }
        } else {
            console.log(`NOT sending token ${token} yet`);
            state.tokenToSend = token;
        }
    }



    get isLoaded() {
        return this.PBX && this.PBX.Auth && typeof this.PBX.Auth === 'object';
    }

}

export {
    IPCortexAPI,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia
}
