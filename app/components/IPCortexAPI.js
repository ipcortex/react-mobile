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

var ogetUserMedia = WebRTC.getUserMedia;

getUserMedia = WebRTC.getUserMedia = function (...args) {
  console.log('getUserMedia args: ', args)

  if(arguments.length == 1)
    f = new Promise((resolve, reject) => ogetUserMedia(...args, resolve, reject));
  else
    f = ogetUserMedia(...args)

  f.then(ret => {
    console.log('GUM ret: ', ret)
    return ret;
  });

  return(f);

}

global.window.localStorage = global.localStorage = { removeItem: () => console.log('removeItem called') };

Object.assign(global.window, WebRTC, { navigator: WebRTC })
global.window.mediaDevices = global.window.navigator.mediaDevices = { getUserMedia };
Object.assign(global.window.navigator, WebRTC);

import expJsSIP from 'jssip';
import expIPCortex from 'ipcortex-api';

global.JsSIP = expJsSIP;
global.IPCortex = expIPCortex;

global.Utils = JsSIP.Utils;

IPCortex.PBX.httpStopReuse();

// We use this variable within the module closure to provide a single load
// of the API state for effciency.
var state = { WebRTC, IPCortex: {}, PBX: {}, Auth: {}, JsSIP };

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
  constructor(singleInstance = true) {
    // By default we use one instance of the API for all
    //  instantiations of this class, as this is what we mostly want.
    if(singleInstance)
      Object.assign(this, state);

  }

  startFeed() {

  }

  patch(module, text) {
    const Patches = [
      { module: 'IPCortex', from: 'var _canReuse = true;', to: 'var _canReuse = false;' },
      { module: 'IPCortex', from: "/* JsSIP.debug.enable('*'); */", to: 'JsSIP.debug.enable("*");' },
      // { module: 'IPCortex', from: 'IPCortex.PBX.Auth.rtcReset(', to: 'Auth.rtcReset(' },
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
   * @method setServer
   * @param  {string}  hostname PBX hostname
   * @return {Promise}
   */
  async setServer(hostname) {
    this.PBX = null;
    this.hostname = host = hostname;
    this.server = server = `https://${hostname}`
    try {
      // If we had an API, invalidate it now

      /*
      let filesNeeded = [ // { import:'adapter', file: '/cinclude/adapter.js'},
        //{ import:'JsSIP', file: '/cinclude/api/jssip/jssip.js'},
        { import: 'IPCortex', file: '/api/api.js' }
      ];
      var code = [];

      // This is more serialised than it needs to be but KISS for now
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
      // module style module.exports and attatches it's payload as a property
      // if it exists as an alternative to creating an IPCortex.PBX global
      // Also throw the WebRTC entrypoints in as params.
      /*
      let exports = {};
      let module = { exports };
      let window = Object.assign({}, WebRTC, { navigator: WebRTC })
      window.mediaDevices = window.navigator.mediaDevices = { getUserMedia };
      Object.assign(window.navigator, WebRTC);
      Object.assign(window, WebRTC);
      window.localStorage = { removeItem: () => console.log('removeItem called') };

      let execParams = { hostname } //Object.assign({}, { module, exports, global, window }, window, state, console);
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
          //[file.import]: module.exports
        })
        // copy exports into the environment of the next module
        Object.assign(execParams, state);
      })
      */
      state.IPCortex = global.IPCortex = global.window.IPCortex
      state.PBX = state.IPCortex.PBX;
      state.JsSIP = JsSIP;
      //Object.assign(state.Auth, state.PBX.Auth);
      // Also stash the created API plus the WebRTC object it references in this instance
      Object.assign(this, state);

      if(this.isLoaded) {
        // Got a PBX obj, resolve to the hostname
        return hostname;
      } else {
        throw `loaded PBX but typeof PBX is ${typeof PBX}`;
      }

    } catch(error) {

      throw `${error.toString()} reading from ${hostname}`
    }
  }
  get isLoaded() {
    return this.PBX && this.PBX.Auth && typeof this.PBX.Auth === 'object'
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
