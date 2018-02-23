import { StackNavigator } from "react-navigation";


import {LoginScreen} from './screens/LoginScreen.js';
import {HomeScreen} from './screens/HomeScreen.js';
import {ForwardScreen} from './screens/ForwardScreen.js';
import {NightModeScreen} from './screens/NightModeScreen.js';

const navigator = StackNavigator(
{
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
});


export default navigator;
