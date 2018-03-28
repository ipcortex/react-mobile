

const initialAuthState = { isLoggedIn: false, targetValid: false };

export const actions = {
    Login: { type: 'LOGIN' },
    Logout: { type: 'LOGOUT' },
    setTarget:  { type: 'AUTH_SETTARGET', hostname: (text) => ({type: 'AUTH_SETTARGET', hostname: text })},
    invalidateTarget: { type: 'AUTH_INVALIDATETARGET' },
    validateTarget: { type: 'AUTH_VALIDATETARGET' },
    setLoginToken:  { type: 'AUTH_SETLOGINTOKEN', token: (text) => ({type: 'AUTH_SETLOGINTOKEN', token: text })},
    loginError:  { type: 'AUTH_LOGINERROR', message: (text) => ({type: 'AUTH_LOGINERROR', message: text })},
    notificationToken:  { type: 'AUTH_NOTIFICATION', token: (o) => ({type: 'AUTH_NOTIFICATION', token: o })}
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
  case actions.loginError.type:
      return { ...state, loginError: action.message };
  case actions.notificationToken.type:
      return { ...state, notificationToken: action.token };

  default:
    return state;
  }
}
