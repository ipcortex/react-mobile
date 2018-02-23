/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, Platform, StyleSheet, Text, View} from 'react-native';

import {StackNavigator} from 'react-navigation';

import {styles} from './config/styles.js';

import {LoginScreen} from './screens/LoginScreen.js';
import {HomeScreen} from './screens/HomeScreen.js';
import {ForwardScreen} from './screens/ForwardScreen.js';
import {NightModeScreen} from './screens/NightModeScreen.js';



const AuthStackNavigator = StackNavigator({Login: LoginScreen});

const MainStackNavigator = StackNavigator({
  Home: {
    screen: HomeScreen
  },
  Forward: {
    screen: ForwardScreen
  },
  NightMode: {
    screen: NightModeScreen
  }
});

const IPCMobile = StackNavigator(
  {
    MainStackNavigator: {
      screen: MainStackNavigator
    },
    LoginModalNavigator: {
      screen: AuthStackNavigator
    }
  }, {
    headerMode: 'none',
    mode: 'modal'
  }
);

export default class App extends Component {
  render() {
    return (<IPCMobile/>);
  }
}

AppRegistry.registerComponent('IPCMobile', () => IPCMobile);
