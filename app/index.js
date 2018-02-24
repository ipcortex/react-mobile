import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';


import { Provider } from "react-redux";
import { createStore, applyMiddleware } from 'redux';

import AppReducer from './reducers';
import AppWithNavigationState from './navigation/AppNavigator';
import { middleware } from './utils/redux';

import {styles} from './config/styles.js';
import AppNavigation from "./navigation";
import configureStore from "./config/store";

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);



export default class IPCMobile extends Component {
  render() {
      return (
          <Provider store={store}>
            <AppWithNavigationState />
          </Provider>
        );
    }

}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
