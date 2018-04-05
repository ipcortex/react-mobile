import { combineReducers } from 'redux';

import { persistReducer } from "redux-persist";

import {mainPersistConfig, sensitivePersistConfig} from '../config/storage';

import authReducer, { actions as authActions } from './auth';
import navReducer, { actions as navActions } from './nav';
import contactsReducer, { actions as contactsActions } from './contacts';
import commsReducer, { actions as commsActions } from './comms';
import recentsReducer, { actions as recentsActions } from './recents';

const AppReducer = combineReducers({
  nav: navReducer,
  auth: persistReducer(sensitivePersistConfig, authReducer),
  contacts: contactsReducer,
	comms: commsReducer,
	recents: recentsReducer
});

const actions = Object.assign({}, authActions, navActions, contactsActions, commsActions, recentsActions);

export default AppReducer;
export { actions } ;
