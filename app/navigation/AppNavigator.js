import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator, TabNavigator, createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LoginScreen } from '../screens/LoginScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PhoneScreen } from '../screens/PhoneScreen.js';
import { ForwardScreen } from '../screens/ForwardScreen';
import { NightModeScreen } from '../screens/NightModeScreen';
import { addListener } from '../utils/redux';


const nestedNav = TabNavigator(
{
    Phone: {
        screen: PhoneScreen,
        navigationOptions: {
            title: 'Phone',
            tabBarLabel: 'Phone',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name="phone" />
            ),
        },
    },
    Forward: {
        screen: ForwardScreen,
        navigationOptions: {
            title: 'Forwards',
            tabBarIcon: ({ tintColor, focused }) => (
                <Icon name="settings" />
            ),
        },
    },
},
{
  tabBarPosition: 'bottom',
  animationEnabled: false,
  swipeEnabled: false,
}

);

/*
const TabNav = createBottomTabNavigator(
  {
    MainTab: {
      screen: PhoneScreen,
      navigationOptions: {
        title: 'Welcome',
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon name="phone" />
        ),
      },
    },
    SettingsTab: {
      screen: ForwardScreen,
      navigationOptions: {
        title: 'Settings',
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon name="settings" />
        ),
      },
    },
  },
  {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);
*/
export const AppNavigator = StackNavigator({
    Home: {
        screen: nestedNav,
    },
    Login: {
        screen: LoginScreen
    }
});



class AppWithNavigationState extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        nav: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired,
    };

    render() {
        const { dispatch, nav, auth } = this.props;
        return(<AppNavigator
        navigation={addNavigationHelpers( { dispatch, state: nav, addListener } )}
        screenProps={{dispatch, auth}}
    />);
    }
}

const mapStateToProps = state => ({ nav: state.nav, auth: state.auth });

export default connect(mapStateToProps)(AppWithNavigationState);
