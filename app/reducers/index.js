import { combineReducers } from 'redux';

import { persistReducer } from "redux-persist";

import { AppNavigator } from '../navigation/AppNavigator';

import {mainPersistConfig, sensitivePersistConfig} from '../config/storage';

import authReducer, { actions as authActions } from './auth';
import navReducer, { actions as navActions } from './nav';

const AppReducer = combineReducers({
  nav: navReducer,
  auth: persistReducer(sensitivePersistConfig, authReducer),
});

const actions = Object.assign({}, authActions, navActions);

export default AppReducer;
export { actions } ;
