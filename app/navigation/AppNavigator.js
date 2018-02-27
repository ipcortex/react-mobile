import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import { LoginScreen } from '../screens/LoginScreen.js';
import { HomeScreen } from '../screens/HomeScreen.js';
import { ForwardScreen } from '../screens/ForwardScreen.js';
import { NightModeScreen } from '../screens/NightModeScreen.js';
import { addListener } from '../utils/redux';

export const AppNavigator = StackNavigator( {
  Login: {
    screen: LoginScreen
  },
  Home: {
    screen: HomeScreen
  },
  Forward: {
    screen: ForwardScreen
  },
  NightMode: {
    screen: NightModeScreen
  }
} );

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
  };

  render() {
    const { dispatch, nav, getState } = this.props;
    return ( <AppNavigator
        navigation={addNavigationHelpers( { dispatch, state: nav, addListener } )}
        screenProps={{dispatch}}
    /> );
  }
}

const mapStateToProps = state => ( { nav: state.nav, auth: state.auth } );

export default connect( mapStateToProps )( AppWithNavigationState );
