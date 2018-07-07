import React, { Component } from 'react';
import {
  AppRegistry,
  Platform,
  StyleSheet,
  View,
  Text
} from 'react-native';

import RecentsList from '../components/RecentsList';

import { styles } from '../config/styles.js';

class RecentsScreen extends React.Component {
  render() {
    return (
        <View style={styles.container}>
					<RecentsList />
        </View>
    );
  }
}

export {
  RecentsScreen
};
