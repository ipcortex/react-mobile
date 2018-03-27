import { Navigation } from 'react-native-navigation';
import LoginScreen from './LoginScreen';
import PhoneScreen from './PhoneScreen';
import ForwardScreen from './ForwardScreen';

export default (store, Provider) =>  {
Navigation.registerComponent('IPCMobile.Login', () => LoginScreen, store, Provider);
Navigation.registerComponent('IPCMobile.Phone', () => PhoneScreen, store, Provider);
Navigation.registerComponent('IPCMobile.Forward', () => ForwardScreen, store, Provider);
}
