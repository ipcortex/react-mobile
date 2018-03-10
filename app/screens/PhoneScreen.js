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
  static logged_in = 0;
  static navigationOptions = ( { navigation, screenProps } ) => {
    return ( {
      headerTitle: `${ Platform.OS } IPCortex Phone`,
    } );
  };


  render() {
    return ( <View style={styles.container}>
        <Phone />
    </View> );
  }
}

export {
  PhoneScreen
};

AppRegistry.registerComponent( 'PhoneScreen', () => PhoneScreen );
