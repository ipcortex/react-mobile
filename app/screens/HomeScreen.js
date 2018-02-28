import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';


import HomeStatus from '../components/HomeStatus';
import { actions } from '../reducers';

import { styles } from '../config/styles.js';

class HomeScreen extends React.Component {
  static logged_in = 0;
  static navigationOptions = ( { navigation, screenProps } ) => {
    return ( {
      headerTitle: `${ Platform.OS } App title`,
      headerRight: ( <Button
            onPress={() => screenProps.dispatch( actions.Logout )}
            title="Logout"
            color="#000"/> )
    } );
  };


  render() {

    return ( <View>
        <HomeStatus />
    </View> );
  }
}

export {
  HomeScreen
};

AppRegistry.registerComponent( 'HomeScreen', () => HomeScreen );
