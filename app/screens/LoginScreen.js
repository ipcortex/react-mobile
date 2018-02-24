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

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: `${Platform.OS} App Login`
  };
  static propTypes = {
  navigation: PropTypes.object.isRequired,
};



  render() {
    const {navigate} = this.props.navigation;
    return (<View>

      <Button onPress={this.props.login} title="Login"/>
    </View>);
  }
}

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);

export default LoginScreen;
