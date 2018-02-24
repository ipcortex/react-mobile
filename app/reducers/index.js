import { combineReducers } from "redux";
import CounterReducer from "./counterReducer";
import NavigationReducer from "./navigationReducer";
import LoginReducer from "./loginReducer";

const AppReducer = combineReducers({
  CounterReducer,
  NavigationReducer
});

export default AppReducer;
