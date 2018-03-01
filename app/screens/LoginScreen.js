import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { styles } from '../config/styles.js';

import LoginWidget from '../components/LoginWidget';

class LoginScreen extends React.Component {

  static navigationOptions = {
    title: `${ Platform.OS } App Login`
  };
  static propTypes = {
    navigation: PropTypes.object.isRequired

  };

  render() {
    return ( <View style={styles.container}>
      <LoginWidget dispatch = {this.props.navigation.dispatch}/>
    </View> );
  }
}

AppRegistry.registerComponent( 'LoginScreen', () => LoginScreen );

export {
  LoginScreen
};
