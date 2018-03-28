import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';

import ContactsList from '../components/ContactsList';

import { styles, uiTheme, ThemeProvider } from '../config/styles.js';

class ContactsScreen extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
          <ContactsList />
        </View>
      </ThemeProvider>
    );
  }
}

export {
  ContactsScreen
};

AppRegistry.registerComponent('ContactsScreen', () => ContactsScreen);

