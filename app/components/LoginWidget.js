import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Button, View } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '../config/styles.js';

export class LoginWidget extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      forward: false
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    //nav: PropTypes.object.isRequired
  };


  render() {
    return ( <View style={styles.vsub}>
      <View style={styles.heading}>
        <Text style={styles.h1}>Some Login Stuff</Text>
      </View>
      <View style={styles.fullcontrol}>
        <Button onPress={() => this.props.dispatch( { type: 'Login' } )} title="Login"/>
      </View>
    </View> );
  }
}
