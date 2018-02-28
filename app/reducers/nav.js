import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigation/AppNavigator';

// Start with two routes: The Main screen, with the Login screen on top.
const firstAction = AppNavigator.router.getActionForPathAndParams('Home');
const tempNavState = AppNavigator.router.getStateForAction(firstAction);
const secondAction = AppNavigator.router.getActionForPathAndParams('Login');
const initialNavState = AppNavigator.router.getStateForAction(
  secondAction,
  tempNavState
);

import { actions as authActions } from './auth';

const actions = Object.assign(authActions, {
  NightMode: { type: 'NAV_NIGHTMODE' },
  Forward: { type: 'NAV_FORWARD' },
});

export { actions };

export default (state = initialNavState, action) => {
  let nextState;
  switch(action.type) {
  case actions.Login.type:
    nextState = AppNavigator.router.getStateForAction(
      NavigationActions.back(),
      state
    );
    break;
  case actions.Logout.type:
    nextState = AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: 'Login' }),
      state
    );
    break;
  case actions.Forward.type:
    nextState = AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: 'Forward' }),
      state
    );
    break;
  case actions.NightMode.type:
    nextState = AppNavigator.router.getStateForAction(
      NavigationActions.navigate({ routeName: 'NightMode' }),
      state
    );
    break;
  default:
    nextState = AppNavigator.router.getStateForAction(action, state);
    break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}
