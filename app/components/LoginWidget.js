import React, { Component } from 'react';
import { Platform, StyleSheet, Text, Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { styles } from '../config/styles.js';

class LoginWidget extends Component {

  constructor( props ) {
    super( props );
    if(this.props.auth.isLoggedIn)
        this.props.dispatch( { type: 'Login' } );
}

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
  };


  render() {
    return ( <View style={styles.vsub}>
      <View style={styles.heading}>
        <Text style={styles.h1}>Some Login Stuff</Text>
      </View>
      <View style={styles.fullcontrol}>
        <Button onPress={() => this.props.dispatch( { type: 'Login' } )} title="Login"/>
      </View>
    </View> );
  }
}


const mapStateToProps = state => ({
  dispatch: state.dispatch,
  auth: state.auth
});

export default connect(mapStateToProps)(LoginWidget);
