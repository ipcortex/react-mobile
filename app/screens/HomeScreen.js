import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { connect } from "react-redux";

import { styles } from '../config/styles.js';

class HomeScreen extends React.Component {
  static logged_in = 0;
  static navigationOptions = ( { navigation, screenProps } ) => {
    return ( {
      headerTitle: `${ Platform.OS } App title`,
      headerRight: ( <Button
            onPress={() => screenProps.dispatch( { type: 'Logout' } )}
            title="Logout"
            color="#000"/> )
    } );
  };

  constructor( props ) {
    super( props );
    if ( !props.screenProps.auth.isLoggedIn )
      this.props.navigation.dispatch( { type: 'Logout' } );
  }


  render() {

    return ( <View>

      <Button onPress={() => this.props.navigation.dispatch( { type: 'Forward' } )} title="Set forwards"/>
      <Button onPress={() => this.props.navigation.dispatch( { type: 'NightMode' } )} title="Manage Nightmodes"/>
    </View> );
  }
}

export {
  HomeScreen
};

AppRegistry.registerComponent( 'HomeScreen', () => HomeScreen );
