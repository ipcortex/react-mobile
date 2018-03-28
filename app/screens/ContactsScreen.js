import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';

import { actions } from '../reducers';
import { styles, uiTheme, ThemeProvider } from '../config/styles.js';

class ContactsScreen extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <Text>Hello Contacts</Text>
        </View>
      </ThemeProvider>
    );
  }
}

export {
  ContactsScreen
};

AppRegistry.registerComponent('ContactsScreen', () => ContactsScreen);

