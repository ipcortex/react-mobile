import React, {Component} from 'react';
import {AppRegistry, Platform } from 'react-native';


import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import pushNotification from 'lib/pushNotification';

import AppReducer, { actions } from './reducers';
import AppWithNavigationState from './navigation/AppNavigator';
import { middleware } from './utils/redux';

import { styles, ThemeProvider, uiTheme } from './config/styles.js';

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);
const persistor = persistStore(store);


var notification = new (store.dispatch, actions.notificationToken.token, actions.Phone);
// This needs to be here as it has to initialise
//  when the app is launched in background mode which
//  doesn't start the React lifecycle. Any deeper in the
//  project and onNotification isn't primed to fire when
//  the app is (re)started which means we don't process background
//  notifications
notification.register();



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
