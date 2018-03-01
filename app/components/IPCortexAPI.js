import { styles } from '../config/styles.js';
import { actions } from '../reducers';
var PBX = null;

class IPCortexAPI {

    constructor(){
        this.PBX = PBX;
    }

    async setServer(hostname) {
        try {
            this.server = `https://${hostname}`
            let response = await fetch(`${this.server}/api/api.js`);
            if(response.status == 200){
                let exports = {};
                let module = {exports: exports};
                let code = await response.text();
                let api = Function('module', 'exports', code);
                api(module, exports);
                this.PBX = PBX = module.exports.PBX;

            }
            else {
                throw `bad status ${response.status} ${response.statusText} loading api/api.js`
            }
            if(typeof PBX == 'object'){
                return hostname;
            }
            else {
                throw `loaded PBX but typeof PBX is ${typeof PBX}`;
            }

        } catch(error) {

            throw `${error.toString()} reading from ${hostname}`
        }
    }


}

export {IPCortexAPI}
