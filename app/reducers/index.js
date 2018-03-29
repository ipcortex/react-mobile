import { combineReducers } from 'redux';

import { persistReducer } from "redux-persist";

import {mainPersistConfig, sensitivePersistConfig} from '../config/storage';

import authReducer, { actions as authActions } from './auth';
import navReducer, { actions as navActions } from './nav';
import contactsReducer, { actions as contactsActions } from './contacts';

const AppReducer = combineReducers({
  nav: navReducer,
  auth: persistReducer(sensitivePersistConfig, authReducer),
  contacts: contactsReducer
});

const actions = Object.assign({}, authActions, navActions, contactsActions);

export default AppReducer;
export { actions } ;
