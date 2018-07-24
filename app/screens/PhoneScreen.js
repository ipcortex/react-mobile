import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View
} from 'react-native';


import Phone from '../components/Phone';
import { actions } from '../reducers';

import { styles } from '../config/styles.js';

class PhoneScreen extends React.Component {
  render() {
    return (
        <View style={styles.container}>
        <Phone navigator={this.props.navigator}/>
    </View>
  );
  }
}

export {
  PhoneScreen
};

AppRegistry.registerComponent( 'PhoneScreen', () => PhoneScreen );
