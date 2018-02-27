import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';


import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import AppReducer from './reducers';
import AppWithNavigationState from './navigation/AppNavigator';
import { middleware } from './utils/redux';

import {styles} from './config/styles.js';

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);
const persistor = persistStore(store)



export default class IPCMobile extends Component {
  render() {
      return (
          <Provider store={store}>
              <PersistGate loading={null} persistor={persistor}>
            <AppWithNavigationState />
            </PersistGate>
          </Provider>
        );
    }

}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
