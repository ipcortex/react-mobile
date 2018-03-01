import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';


class IPCortexAPI extends Component {
    constructor(props) {
        super(props);

    }

    async setServer(hostname) {
        try {
            this.props.dispatch(actions.invalidateTarget);
            let response = await fetch(`https://${hostname}/api/api.js`);
            if(response.status == 200){
                let exports = {};
                let module = {exports: exports};
                let code = await response.text();
                let api = new Function(code);
                let env = {};
                let res = api.call(env);
                foo();
            }
            else {
                this.setState({ apiError: `bad status ${response.status} ${response.statusText} loading api/api.js` });
                return;
            }
            if(typeof IPCortex.API == 'function')
                this.props.dispatch(actions.validateTarget);
            else {
                this.setState({ apiError: `loaded API but typeof API is ${typeof IPCortex.API}` });
            }

        } catch(error) {

            this.setState({ apiError: `${error.toString()} reading from ${hostname}` });
        }
    }
}



const mapStateToProps = state => ({
    dispatch: state.dispatch,
    isLoggedIn: state.auth.isLoggedIn,
    target: state.auth.target,
    targetValid: state.auth.targetValid
});

export default connect(mapStateToProps)(IPCortexAPI);
export {IPCortex};
