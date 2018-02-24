import { Navigation } from 'react-native-navigation';
import Login from './LoginScreen';
import Home from './HomeScreen';
import NightMode from './NightModeScreen';
import Forward from './ForwardScreen';


export default (store, Provider) =>  {
	Navigation.registerComponent('IPCMobile.Login', () => Login, store, Provider);
    Navigation.registerComponent('IPCMobile.HomeTab', () => Home, store, Provider);
    Navigation.registerComponent('IPCMobile.NightMode', () => NightMode, store, Provider);
    Navigation.registerComponent('IPCMobile.Forward', () => Forward, store, Provider);

}
