import { AppNavigator } from '../navigation/AppNavigator';

const initialNavState = { root: 'login' }

import { actions as authActions } from './auth';

const actions = Object.assign(authActions, {
  NightMode: { type: 'NAV_NIGHTMODE' },
  Forward: { type: 'NAV_FORWARD' },
  Phone: { type: 'NAV_PHONE' },

});

export { actions };

export default (state = initialNavState, action) => {
  let nextState;
  switch(action.type) {
  case actions.Login.type:
    return { ...state, root: 'after-login' };
  case actions.Logout.type:
    return { ...state, root: 'login' };
    break;
  default:
    return state;
    break;
  }
}
