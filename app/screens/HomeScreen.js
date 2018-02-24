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


class Home extends React.Component {
  static logged_in = 0;
  static navigationOptions = {
    headerTitle: `${Platform.OS} App title`,
    headerRight: (<Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#000"
      />)
  };

  constructor(props) {
    super(props);
    this.state = {
      logged_in: 0,
      id: Math.random()
    };


  }
  navigate = () => {
    const navigateHome = NavigationActions.navigate({
      routeName: "Home",
      params: { }
    });
    this.props.navigation.dispatch(navigateHome);
  };

  render() {
    

    return (
      <View>

        <Button
          onPress={() => navigate('Forward')}
          title="Set forwards"
        />
        <Button
          onPress={() => navigate('NightMode')}
          title="Manage Nightmodes"
        />
      </View>
    );
  }
}

const mapDispatchToProps = {

};

const HomeScreen = connect(null, mapDispatchToProps)(Home);
export { HomeScreen };

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
