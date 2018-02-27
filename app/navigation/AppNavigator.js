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

  Home: {
    screen: HomeScreen
  },
  Forward: {
    screen: ForwardScreen
  },
  NightMode: {
    screen: NightModeScreen
},
Login: {
  screen: LoginScreen
},

} );

class AppWithNavigationState extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    nav: PropTypes.object.isRequired
  };

  render() {
    const { dispatch, nav, auth } = this.props;
    return ( <AppNavigator
        navigation={addNavigationHelpers( { dispatch, state: nav, addListener } )}
        screenProps={{dispatch, auth}}
    /> );
  }
}

const mapStateToProps = state => ( { nav: state.nav, auth: state.auth } );

export default connect( mapStateToProps )( AppWithNavigationState );
