const initialNavState = { root: 'nothing', refresh: 0 }

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
  case actions.Phone.type:
    return { ...state, refresh: state.refresh+1 };
    break;
  default:
    return state;
    break;
  }
}
