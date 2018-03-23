import React, {Component} from 'react';
import {AppRegistry, Platform } from 'react-native';


import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import AppReducer from './reducers';
import AppWithNavigationState from './navigation/AppNavigator';
import { middleware } from './utils/redux';

import { styles, ThemeProvider, uiTheme } from './config/styles.js';

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);
const persistor = persistStore(store);


/**
 * IPCMobile root React Native Component
 *
 * @type {Class}
 * @name IPCMobile
 */
export default class IPCMobile extends Component {
    /**
     * [render description]
     *
     * @method render
     * @return {[type]} [description]
     */
  render() {
      return (
          <ThemeProvider uiTheme={uiTheme}>
              <Provider store={store}>
                  <PersistGate loading={null} persistor={persistor}>
                      <AppWithNavigationState />
                  </PersistGate>
              </Provider>
          </ThemeProvider>

        );
    }

}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
