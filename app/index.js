import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';
import {styles} from './config/styles.js';

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import AppNavigation from "./navigation";
import configureStore from "./config/store";

const { store, persistor } = configureStore();


export default class IPCMobile extends Component {
  render() {
      return (
        <Provider store={store}>
          <PersistGate loading={<Text>Loading...</Text>} persistor={persistor}>
            <AppNavigation />
          </PersistGate>
        </Provider>
      );
  }
}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
