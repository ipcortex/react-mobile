import React, { Component } from 'react';
import {
     AppRegistry,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from "react-redux";

import { styles } from '../config/styles.js';

import PhoneNumber from '../components/PhoneNumber';
import ForwardState from '../components/ForwardState';

export class ForwardScreen extends Component {
  static navigationOptions = {
    title: 'Call Forwards'
  };
  render() {

    return (
<View style={styles.container}>
        <ForwardState title="Forward"/>
        <PhoneNumber title="Number"/>
      </View>);


  }
}

AppRegistry.registerComponent('ForwardScreen', () => ForwardScreen);
