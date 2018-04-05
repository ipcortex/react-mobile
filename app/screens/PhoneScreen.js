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
  render() {
    return ( <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
        <Phone navigator={this.props.navigator}/>
    </View>
</ThemeProvider> );
  }
}

export {
  PhoneScreen
};

AppRegistry.registerComponent( 'PhoneScreen', () => PhoneScreen );
