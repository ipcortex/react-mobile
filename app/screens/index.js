import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LoginScreen } from './LoginScreen';
import { PhoneScreen } from './PhoneScreen';
import { ForwardScreen } from './ForwardScreen';

var phoneIcon, settingsIcon;
/**
 * Implements react-native-navigation screen layout for this app.
 *
 * /

/**
 * Initialise with a Redux store
 *
 * @method setupScreens
 * @param  {[type]}     store    redux store
 * @param  {[type]}     Provider redux Provider
 */
async function registerScreens(store, Provider) {

  phoneIcon = await Icon.getImageSource('phone', 30);
  settingsIcon = await Icon.getImageSource('settings', 30);

  Navigation.registerComponent('IPCMobile.Login', () => LoginScreen, store, Provider);
  Navigation.registerComponent('IPCMobile.Phone', () => PhoneScreen, store, Provider);
  Navigation.registerComponent('IPCMobile.Forward', () => ForwardScreen, store, Provider);

  return(true);

}

/**
 * Switch to a navigation context
 *
 * @method switchContext
 * @param  {[type]}      context context name as implemented in this function
 */
function switchContext(context) {
  switch(context) {
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
          icon: phoneIcon,
          selectedIcon: phoneIcon,
          title: 'Phone',
          overrideBackPress: false, //this can be turned to true for android
          navigatorStyle: {}
        },
        {
          label: 'Settings',
          screen: 'IPCMobile.Forward',
          icon: settingsIcon,
          selectedIcon: settingsIcon,
          title: 'Settings',
          navigatorStyle: {}
        }

      ],
    });
    return;
  default: //no root found
  }
}

export { registerScreens, switchContext };
