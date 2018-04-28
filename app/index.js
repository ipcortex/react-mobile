import React, { Component } from 'react';
import { AppRegistry, Platform } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from "redux";

import { Provider } from "react-redux";

import { Navigation } from 'react-native-navigation';

import { registerScreens, switchContext } from './screens';

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import InCallManager from 'react-native-incall-manager';


import pushNotification from './lib/pushNotification';
import { IPCortexAPI } from './lib/IPCortexAPI';

import AppReducer, { actions } from './reducers';

import thunk from "redux-thunk";


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(
    AppReducer,
);

var persistor;

if(Platform.OS === 'android')
    persistor = persistStore(store);

var notification = new pushNotification(store.dispatch,
    actions.notificationToken.token,
    actions.Phone);
// This needs to be here as it has to initialise
//  when the app is launched in background mode which
//  doesn't start the React lifecycle. Any deeper in the
//  project and onNotification isn't primed to fire when
//  the app is (re)started which means we don't process background
//  notifications
notification.register({
    Ring: function() {
        InCallManager.startRingtone('_BUNDLE_',null,null,15);
    }
},
{
    Accept: function() {
        InCallManager.stopRingtone();
        store.dispatch({type: actions.AcceptCall}) },
    Reject: function() {
        InCallManager.stopRingtone();
        store.dispatch({type: actions.RejectCall}) }
});
/**
 * IPCMobile root React Native Component
 *
 * @type {Class}
 * @name IPCMobile
 */
export default class IPCMobile extends Component {
    constructor(props) {
        super(props);
        var api = new IPCortexAPI(true, store, Provider);
        registerScreens(store, Provider)
            .then(() => {
                if(Platform.OS === 'ios') {
                    // Dont fire our first event until we are sure the redux
                    // persistent store is re-hydrated
                    persistor = persistStore(store, null, () => {
                        store.subscribe(this.onStoreUpdate.bind(this));
                        store.dispatch(actions.Logout);
                    });
                } else {
                    store.subscribe(this.onStoreUpdate.bind(this));
                    store.dispatch(actions.Logout);
                }
            })

    }

    onStoreUpdate() {
        let { root } = store.getState()
            .nav;
        // handle a root change
        if(this.currentRoot != root) {
            this.currentRoot = root;
            this.startApp(root);
        }
    }

    startApp(root) {
        // This is a workaround for the fact that JsSIP sets a re-registration timer
        // for multiple minutes and this is an anti-pattern in Android apps.
        // We don't care about this because we are content to let the registration die,
        // but the console nag is a pain.
        console.ignoredYellowBox = [
                'Setting a timer', 'Remote debugger'
        ];
        switchContext(root);

    }

}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
