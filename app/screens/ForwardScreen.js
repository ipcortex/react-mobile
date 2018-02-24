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

import { PhoneNumber } from '../components/PhoneNumber';
import { ForwardState } from '../components/ForwardState';

class Forward extends Component {
  static navigationOptions = {
    title: 'Call Forwards'
  };
  render() {
    const {navigate} = this.props.navigation;
    return (
<View style={styles.container}>
        <ForwardState title="Forward"/>
        <PhoneNumber title="Number"/>
      </View>);


  }
}

const mapDispatchToProps = {

};

const ForwardScreen = connect(null, mapDispatchToProps)(Forward);
export { ForwardScreen };

AppRegistry.registerComponent('ForwardScreen', () => ForwardScreen);
