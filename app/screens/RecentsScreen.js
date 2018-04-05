import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';

import RecentsList from '../components/RecentsList';

import { styles, uiTheme, ThemeProvider } from '../config/styles.js';

class RecentsScreen extends React.Component {
  render() {
    return (
      <ThemeProvider uiTheme={uiTheme}>
        <View style={styles.container}>
					<RecentsList />
        </View>
      </ThemeProvider>
    );
  }
}

export {
  RecentsScreen
};

AppRegistry.registerComponent('RecentsScreen', () => RecentsScreen);

