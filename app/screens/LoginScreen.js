import React, { Component } from 'react';
import {
     AppRegistry,
    Button,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { styles } from '../config/styles.js';


export class HomeScreen extends React.Component {
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



componentWillMount(){
    const { navigate } = this.props.navigation;

    if(!(this.state.logged_in++))
      navigate('LoginModalNavigator');
    console.log('**componentWillMount', this.state);
}

componentDidMount()
{
    console.log('**componentDidMount', this.state);
}


componentWillReceiveProps(props)
{
    console.log('**componentWillReceiveProps', props, this.state);
}
shouldComponentUpdate(nextprops, nextstate)
{
    console.log('**shouldComponentUpdate', nextprops, nextstate, this.state);
}

componentWillUpdate(nextprops, nextstate)
{
    console.log('**componentWillUpdate', nextprops, nextstate, this.state);
}
componentDidUpdate(nextprops, nextstate)
{
    console.log('**componentDidUpdate', nextprops, nextstate, this.state);
}

componentWillUnmount(){
    console.log('**componentWillUnMount', this.state);
}


  render() {
    const { navigate } = this.props.navigation;

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

AppRegistry.registerComponent('HomeScreen', () => HomeScreen);
