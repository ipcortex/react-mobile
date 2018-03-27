import { Navigation } from 'react-native-navigation';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


/*
const nestedNav = TabNavigator({
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
    }, {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
    }

);


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

export const AppNavigator = StackNavigator({
    Home: {
        screen: nestedNav,
    },
    Login: {
        screen: LoginScreen
    }
});

*/


class AppWithNavigationState extends React.Component {
    constructor(props) {
        super(props);
        store.subscribe(this.onStoreUpdate.bind(this));
        store.dispatch(appActions.appInitialized());
    }

    onStoreUpdate() {
        let { root } = store.getState()
            .app;
        // handle a root change
        if(this.currentRoot != root) {
            this.currentRoot = root;
            this.startApp(root);
        }
    }

    startApp(root) {
        switch(root) {
            case 'login':
            Navigation.startSingleScreenApp({
                        screen: {
                        screen: 'IPCMobile.Login',
                        title: 'Login',
                        navigatorStyle: {},
                        navigatorButtons: {}
                    },
            });
            return;
            case 'after-login':
                Navigation.startTabBasedApp({
                    tabs: [{
                            label: 'Phone',
                            screen: 'IPCMobile.Phone',
                            //icon: require('./img/checkmark.png'),
                            //selectedIcon: require('./img/checkmark.png'),
                            title: 'Phone',
                            overrideBackPress: false, //this can be turned to true for android
                            navigatorStyle: {}
                        },
                        {
                            label: 'Settings',
                            screen: 'IPCMobile.Forwards',
                            //icon: require('./img/checkmark.png'),
                            //selectedIcon: require('./img/checkmark.png'),
                            title: 'Settings',
                            navigatorStyle: {}
                        }

                    ],
                });
                return;
            default: //no root found
        }
    }
}
