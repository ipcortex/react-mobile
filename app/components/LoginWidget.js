import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';




import { styles } from '../config/styles.js';
import { actions } from '../reducers';

import { IPCortexAPI } from '../lib/IPCortexAPI';
import IPCortexConfig from '../config/ipcortex';

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

        return (<TextInput
                value={this.state.value}
                onChangeText={(text) => this.validateStyle(text, false)}
                onSubmitEditing={(event) => this.submit()}
                returnKeyType={'done'}
                style = {this.state.style}
            />)
    }

    // This is approximately a FQDN
    // TODO IDNs?
    static validate(text) {
        return (text.match(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/) != null)
    }

    validateStyle(text, final) {
        const valid = InputDomainName.validate(text);
        this.setState({ value: text.toLowerCase() });
        if (text === '')
            this.setState({ style: styles[this.state.baseStyle] });
        else if (valid && styles[this.state.baseStyle + 'OK'])
            this.setState({ style: styles[this.state.baseStyle + 'OK'] });
        else if (!valid && !final && styles[this.state.baseStyle + 'Warning'])
            this.setState({ style: styles[this.state.baseStyle + 'Warning'] });
        else if (!valid && final && styles[this.state.baseStyle + 'Error'])
            this.setState({ style: styles[this.state.baseStyle + 'Error'] });
        return (valid);
    }

    submit() {
        let text = this.state.value;
        if (this.validateStyle(text, true))
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
        /** Redux dispatcher */
        dispatch: PropTypes.func.isRequired,
        /** Are we logged in to API */
        isLoggedIn: PropTypes.bool.isRequired,
        /** If not isLoggedIn, the last login error */
        loginError: PropTypes.string,
        /** Login token returned by last API login, may or may not be valid */
        loginToken: PropTypes.array,
        /** Push token */
        notificationToken: PropTypes.object,
        /** The target PBX hostname */
        target: PropTypes.string,
        /** true if we have sucessfully loaded the API from the target host */
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
        this.state = { doLogin: false };
        this.IPCortex = new IPCortexAPI();

    }
    /**
     * Render inline tags to output confirmation of current login server (if API is valid),
     * or input a new one if we don't have one yet.
     *
     * @method input_server
     * @return {ReactTags}    JSX fragment to use in upstream render
     */
    input_server() {
        if (this.props.targetValid) {
            return (<View style={styles.hsubThin}>
          <View style={styles.label}><Text>Login to {this.props.target}</Text></View>
          <View style={styles.control}><Button onPress={() => this.props.dispatch( actions.invalidateTarget )} title="Change Server"/></View>
      </View>)
        } else {
            return (<View style={styles.vsub}>
          <Text>Server</Text>
          <InputDomainName
              value={this.props.target}
              onSubmit={(text) => {
                      this.setState({hostname: text});
                      this.props.dispatch(actions.setTarget.hostname(text));
              }
            }
              />
          <Text>{this.state.apiError}</Text>
      </View>)
        }
    }


    do_login() {
        this.IPCortex.doLogin({ username: this.state.username, password: this.state.password }, this.props.target)
            .then((status) => this.props.dispatch(actions.Login))
            .catch((err) => console.log('login failed'));

    }
    input_login() {
        if (this.props.targetValid)
            return (<View style={styles.vsub}>
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
                    onSubmitEditing={() => this.do_login()}
                  />
              </View>
          <View style={{flex:0.1}}/>
          </View>
          <View style={{flex: 4}}>
              <Button style={{flex: 4}}
                  onPress={() => this.do_login()}
                  title="Login"/>
              </View>
            <Text>{this.props.loginError}</Text>
            </View>

            );
        return;
    }

    componentDidMount() {
        console.info('componentDidMount', arguments);
    }
    shouldComponentUpdate(props, state) {
        console.info('shouldComponentUpdate', this.props, arguments);
        return (true);
    }
    render() {
        console.info('render: props: ', this.props);
        return (<View style={styles.vsub}>
          <View style={styles.vsubThin}>
            {this.input_server()}
          </View>
          <View style={styles.vsub}>
            {(this.props.targetValid)?this.input_login():
              (
                <Text>
                  Enter your PBX server domain name
                </Text>
              )}
            </View>
            <View/>
          </View>);


    }
}


const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    loginError: state.loginError,
    loginToken: state.auth.loginToken,
    notificationToken: state.auth.notificationToken,
    target: state.auth.target,
    targetValid: state.auth.targetValid,
});

const mapDispatchToProps = dispatch => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginWidget);
