import { AppNavigator } from '../navigation/AppNavigator';

const initialAuthState = { isLoggedIn: false };

export default (state = initialAuthState, action) => {
  switch(action.type) {
  case 'Login':
    return { ...state, isLoggedIn: true };
  case 'Logout':
    return { ...state, isLoggedIn: false };
  default:
    return state;
  }
}
