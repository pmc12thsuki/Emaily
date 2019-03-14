import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

export default combineReducers({
  // whatever keys we provide to this object are going to represent the keys that exist inside of our state object
  // key 的名字就是之後我們要在 store 中代表這個 reducer 的名字
  auth: authReducer,
  form: reduxFormReducer, // reduxform use default reducer name as 'form'
  surveys: surveysReducer,
});
