import { AppNavigator } from '../navigation/AppNavigator';

const initialAuthState = { isLoggedIn: false, target: 'pabx1.ipcortex.net', targetValid: false };

export const actions = {
    Login: { type: 'LOGIN' },
    Logout: { type: 'LOGOUT' },
    setTarget:  { hostname: (text) => ({type: 'AUTH_SETTARGET', hostname: text })},
    invalidateTarget: { type: 'AUTH_INVALIDATETARGET' },
    validateTarget: { type: 'AUTH_VALIDATETARGET' },
    setLoginToken:  { token: (text) => ({type: 'AUTH_SETLOGINTOKEN', token: text })},
}

export default (state = initialAuthState, action) => {
  switch(action.type) {
  case actions.Login.type:
    return { ...state, isLoggedIn: true };
  case actions.Logout.type:
    return { ...state, isLoggedIn: false };
  case actions.setTarget.type:
    return { ...state, target: action.hostname, targetValid: false  };
  case actions.invalidateTarget.type:
      return { ...state, targetValid: false };
  case actions.validateTarget.type:
    return { ...state, targetValid: true };
  case actions.setLoginToken.type:
    return { ...state, loginToken: action.token };




  default:
    return state;
  }
}
