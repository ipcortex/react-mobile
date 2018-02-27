import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';

import { persistReducer } from "redux-persist";

import { AppNavigator } from '../navigation/AppNavigator';

import {mainPersistConfig, sensitivePersistConfig} from '../config/storage';

import authReducer from './auth';
import navReducer from './nav';

const AppReducer = combineReducers({
  nav: persistReducer(mainPersistConfig, navReducer),
  auth: persistReducer(sensitivePersistConfig, authReducer),
});

export default AppReducer;
