import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View
} from 'react-native';


import Phone from '../components/Phone';
import { actions } from '../reducers';

import { styles, uiTheme, ThemeProvider } from '../config/styles.js';

class PhoneScreen extends React.Component {
  static logged_in = 0;
  static navigationOptions = ( { navigation, screenProps } ) => {
    return ( {
      headerTitle: `${ Platform.OS } IPCortex Phone`,
    } );
  };


  render() {
    return ( <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
        <Phone />
    </View>
</ThemeProvider> );
  }
}

export {
  PhoneScreen
};

AppRegistry.registerComponent( 'PhoneScreen', () => PhoneScreen );
