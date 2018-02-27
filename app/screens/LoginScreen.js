import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import {styles} from '../config/styles.js';

class LoginScreen extends React.Component {



  static navigationOptions = {
    title: `${Platform.OS} App Login`
  };
  static propTypes = {
  navigation: PropTypes.object.isRequired,
};



  render() {
    return (<View>
        <LoginWidget />
    </View>);
  }
}

AppRegistry.registerComponent('LoginScreen', () => LoginScreen);

export { LoginScreen };
