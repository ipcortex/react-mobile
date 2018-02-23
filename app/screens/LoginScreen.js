import React, {Component} from 'react';

import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from "react-redux";
import { login } from "../actions/actionCreator";

import {styles} from '../config/styles.js';

export class Login extends React.Component {
  static navigationOptions = {
    title: `${Platform.OS} App Login`
  };



  render() {
    const {navigate} = this.props.navigation;
    return (<View>

      <Button onPress={this.props.login} title="Login"/>
    </View>);
  }
}

const mapDispatchToProps = {
  login
};
const LoginScreen = connect(null, mapDispatchToProps)(Login);
export default LoginScreen;

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);
