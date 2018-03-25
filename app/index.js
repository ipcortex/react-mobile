import React, {Component} from 'react';
import {AppRegistry, Platform } from 'react-native';


import { Provider } from "react-redux";
import { compose, createStore, applyMiddleware } from 'redux';
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import AppReducer, { actions } from './reducers';
import AppWithNavigationState from './navigation/AppNavigator';
import { middleware } from './utils/redux';

import PushNotification from 'react-native-push-notification';

import { styles, ThemeProvider, uiTheme } from './config/styles.js';

const store = createStore(
  AppReducer,
  applyMiddleware(middleware),
);
const persistor = persistStore(store);


// https://github.com/zo0r/react-native-push-notification
PushNotification.configure({

  // (optional) Called when Token is generated (iOS and Android)
  onRegister: ({token, os}) => {
    store.dispatch(actions.notificationToken.token({token, os}));
  },

  // (required) Called when a remote or local notification is opened or received
  onNotification: (notification) => {
    console.log('notification', notification)
    store.dispatch(actions.Phone);
  },

  // ANDROID ONLY: (optional) GCM Sender ID.
  senderID: '86871340226',

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true
  },

  // Should the initial notification be popped automatically
  // default: true
  // Leave this off unless you have good reason.
  popInitialNotification: true,

  requestPermissions: false
});
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
