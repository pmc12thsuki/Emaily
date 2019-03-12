import { combineReducers } from 'redux';
import authReducer from './authReducer';

export default combineReducers({
  // whatever keys we provide to this object are going to represent the keys that exist inside of our state object
  // key 的名字就是之後我們要在 store 中代表這個 reducer 的名字
  auth: authReducer,
});
