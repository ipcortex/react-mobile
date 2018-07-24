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

  render() {
    return ( <View style={styles.container}>
      <LoginWidget/>
    </View> );
  }
}


export {
  LoginScreen
};
