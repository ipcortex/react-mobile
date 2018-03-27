import React, { Component } from 'react';
import { AppRegistry, Platform } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from "redux";

import { Provider } from "react-redux";

import { Navigation } from 'react-native-navigation';

import registerScreens from './screens';

import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import pushNotification from './lib/pushNotification';

import AppReducer, { actions } from './reducers';

import thunk from "redux-thunk";


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const store = createStoreWithMiddleware(
    AppReducer,
);

var persistor;

registerScreens(store, Provider);


var notification = new pushNotification(store.dispatch, actions.notificationToken.token, actions.Phone);
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
    constructor(props) {
        super(props);
        store.subscribe(this.onStoreUpdate.bind(this));
        // Dont fire our first event until we are sure the redux
        // persistent store is re-hydrated
        persistor = persistStore(store, null, () => {
            store.dispatch(actions.Logout);
        });
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
        switch(root) {
            case 'login':
                Navigation.startSingleScreenApp({
                    screen: {
                        screen: 'IPCMobile.Login',
                        title: 'Login',
                        navigatorStyle: {},
                        navigatorButtons: {}
                    },
                });
                return;
            case 'after-login':
                Navigation.startTabBasedApp({
                    tabs: [{
                            label: 'Phone',
                            screen: 'IPCMobile.Phone',
                            //icon: require('./img/checkmark.png'),
                            //selectedIcon: require('./img/checkmark.png'),
                            title: 'Phone',
                            overrideBackPress: false, //this can be turned to true for android
                            navigatorStyle: {}
                        },
                        {
                            label: 'Settings',
                            screen: 'IPCMobile.Forward',
                            //icon: require('./img/checkmark.png'),
                            //selectedIcon: require('./img/checkmark.png'),
                            title: 'Settings',
                            navigatorStyle: {}
                        }

                    ],
                });
                return;
            default: //no root found
        }
    }
}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
