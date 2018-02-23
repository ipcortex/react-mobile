import React, {Component} from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {styles} from '../config/styles.js';

export class LoginScreen extends React.Component {
  static navigationOptions = {
    title: `${Platform.OS} App Login`
  };
  render() {
    const {navigate} = this.props.navigation;
    return (<View>

      <Button onPress={() => navigate('Home')} title="Login"/>
    </View>);
  }
}

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);
