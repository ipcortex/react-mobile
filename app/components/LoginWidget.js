import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';




import { styles } from '../config/styles.js';
import { actions } from '../reducers';

import { IPCortexAPI } from './IPCortexAPI';

/**
 * Input a domain name with validation and format hints
 *
 * @extends Component
 */
class InputDomainName extends Component {
    constructor(props) {
        super(props);
        let style = (props.style) ? props.style : 'domainInput';
        this.state = { style: styles[style], baseStyle: style, value: props.value };
    }
    render() {

        return(<TextInput
                value={this.state.value}
                onChangeText={(text) => this.validateStyle(text, false)}
                onSubmitEditing={(event) => this.submit(event)}
                returnKeyType={'done'}
                style = {this.state.style}
            />)
    }

    // This is approximately a FQDN
    // TODO IDNs?
    static validate(text) {
        return(text.match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/) != null)
    }

    validateStyle(text, final) {
        const valid = InputDomainName.validate(text);
        this.setState({ value: text.toLowerCase() });
        if(text === '')
            this.setState({ style: styles[this.state.baseStyle] });
        else if(valid && styles[this.state.baseStyle + 'OK'])
            this.setState({ style: styles[this.state.baseStyle + 'OK'] });
        else if(!valid && !final && styles[this.state.baseStyle + 'Warning'])
            this.setState({ style: styles[this.state.baseStyle + 'Warning'] });
        else if(!valid && final && styles[this.state.baseStyle + 'Error'])
            this.setState({ style: styles[this.state.baseStyle + 'Error'] });

        return(valid);

    }

    submit() {
        let text = this.state.value;
        if(this.validateStyle(text, true))
            this.props.onSubmit(text);
    }

}

/**
 * React component to handle specifiying a PBX and logging in an API instance
 *
 * @extends Component
 */
class LoginWidget extends Component {

    // We expect to get these state variables as props
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isLoggedIn: PropTypes.bool.isRequired,
        loginError: PropTypes.string,
        loginToken: PropTypes.object,
        target: PropTypes.string.isRequired,
        targetValid: PropTypes.bool.isRequired,
    };

    /**
     * Creates a instance with props
     *
     * @method constructor
     * @param  {object}    props React props
     */
    constructor(props) {
        super(props);
        this.state = {};
        this.IPCortex = new IPCortexAPI();
        // If we have a hostname then initialise (load the API) from it
        // If we also have a previous login toekn then giv it a try as soon as
        // the API initialises
        if(props.target != '')
            this.IPCortex.setServer(props.target)
            .then((hostname) => {
                this.props.dispatch(actions.validateTarget)
                if(this.props.loginToken)
                    this.do_login({token: loginToken});
            })
            .catch((err) => {
                this.props.dispatch(actions.invalidateTarget);
                this.setState({ apiError: err.toString() });
            })

    }
    /**
     * Render inline tags to output confirmation of current login server (if API is valid),
     * or input a new one if we don't have one yet.
     *
     * @method input_server
     * @return {ReactTags}    JSX fragment to use in upstream render
     */
    input_server() {
        if(this.props.targetValid) {
            return(<View style={styles.hsubThin}>
          <View style={styles.label}><Text>Login to {this.props.target}</Text></View>
          <View style={styles.control}><Button onPress={() => this.props.dispatch( actions.invalidateTarget )} title="Change Server"/></View>
      </View>)
        } else {
            return(<View style={styles.vsub}>
          <Text>Server</Text>
          <InputDomainName
              value={this.props.target}
              onSubmit={(text) => {
                                this.props.dispatch( actions.setTarget.hostname(text) )
                                if(text != '')
                                    this.IPCortex.setServer(text)
                                    .then((hostname) => this.props.dispatch(actions.validateTarget))
                                    .catch((err) => {
                                            this.props.dispatch(actions.invalidateTarget);
                                            this.setState({ apiError: err.toString() });
                                    })
                        }
              }
              />
          <Text>{this.state.apiError}</Text>
      </View>)
        }
    }
    /**
     * User login to an instance of the API. Async, returns immediately and caller never
     * finds out any more. Ultimately dispatches a 'Login' or 'loginError' state change
     * action on the UI.
     *
     * @method do_login
     * @param  {Object} credentials eiher {username: 'username', password: 'password' }, or {token:}
     *
     */
    do_login(credentials) {
        try {
            this.IPCortex.PBX.Auth.setHost(`https://${this.props.target}`);
            this.IPCortex.PBX.Auth.login(Object.assign({
                    notoken: false,
                    nodom: true,
                    tokenCB: (token) => this.props.dispatch(actions.setLoginToken.token(token))
                }, credentials))
                .then(res => {
                    this.props.dispatch(actions.Login);
                })
                .catch((err) => {
                    this.props.dispatch(actions.loginError.message(err.toString()));
                });

        } catch(err) {
            this.props.dispatch(actions.loginError.message(err.toString()));
        }


    }

    input_login() {
        if(this.props.targetValid)
            return(<View style={styles.vsub}>
                <View style={styles.hsub}>
                <View style={{flex:0.1}}/>
                    <View style={{flex:1}}>
                <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(username) => this.setState({username})}
                value={this.state.username}
                autoCapitalize={'none'}
                placeholder={'Username'}
              /></View>
          <View style={{flex:0.1}}/>
          </View>
                <View style={styles.hsub}>
                    <View style={{flex:0.1}}/>
                        <View style={{flex:1}}>

                    <TextInput
                    style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                    onChangeText={(password) => this.setState({password})}
                    value={this.state.password}
                    secureTextEntry={true}
                    placeholder={'Password'}
                    onSubmitEditing={() => this.do_login({username: this.state.username, password: this.state.password})}
                  />
              </View>
          <View style={{flex:0.1}}/>
          </View>
          <View style={{flex: 4}}>
              <Button style={{flex: 4}}
                  onPress={() => this.do_login({username: this.state.username, password: this.state.password})}
                  title="Login"/>
              </View>
            <Text>{this.props.loginError}</Text>
            </View>

            );
        return;
    }


    render() {

        return(<View style={styles.vsub}>
            <View style={styles.vsubThin}>{this.input_server()}</View>
        <View style={styles.vsub}>{(this.props.targetValid)?this.input_login():
        (<Text>Enter your PBX server domain name</Text>)}</View>
    <View/>
</View>);


    }
}


const mapStateToProps = state => ({
    dispatch: state.dispatch,
    isLoggedIn: state.auth.isLoggedIn,
    loginError: state.loginError,
    loginToken: state.auth.loginToken,
    target: state.auth.target,
    targetValid: state.auth.targetValid,
});

export default connect(mapStateToProps)(LoginWidget);
