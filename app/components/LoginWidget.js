import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TextInput, Button, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { styles } from '../config/styles.js';
import { actions } from '../reducers';

class LoginWidget extends Component {

  constructor( props ) {
    super( props );
    if(this.props.isLoggedIn)
        this.props.dispatch( actions.Login );
    this.state = {};
}

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    target: PropTypes.string.isRequired,
    targetValid: PropTypes.bool.isRequired
  };


  render() {

    return ( <View style={styles.vsub}>
      <View style={styles.heading}>
        <Text style={styles.h1}>{this.props.target}</Text>
          <Text>username</Text>
          <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(username) => this.setState({username})}
          value={this.state.username}
        />

          <Text>password</Text>
              <TextInput
              style={{height: 40, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(password) => this.setState({password})}
              value={this.state.password}
              secureTextEntry={true}
            />


        <Button onPress={() => this.props.dispatch( actions.Login )} title="Login"/>
      </View>
    </View> );
  }
}


const mapStateToProps = state => ({
  dispatch: state.dispatch,
  isLoggedIn: state.auth.isLoggedIn,
  target: state.auth.target,
  targetValid: state.auth.targetValid
});

export default connect(mapStateToProps)(LoginWidget);
