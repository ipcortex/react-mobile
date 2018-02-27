import { AppNavigator } from '../navigation/AppNavigator';

const initialAuthState = { isLoggedIn: false, target: 'pabx1.ipcortex.net', targetValid: false };

export default (state = initialAuthState, action) => {
  switch(action.type) {
  case 'Login':
    return { ...state, isLoggedIn: true };
  case 'Logout':
    return { ...state, isLoggedIn: false };
  case 'setTarget':
    return { ...state, target: action.hostname, targetValid: false  };
  case 'invalidateTarget':
      return { ...state, targetValid: false };
  case 'validateTarget':
  return { ...state, targetValid: true };



  default:
    return state;
  }
}
