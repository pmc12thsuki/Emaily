import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';

// to use reduxThunk, instead of return a action object, we return a function
// if reduxThunk sees that we return a function instead of a normal action, redunThunk will automatically call this function and pass in dispatch function as an argument
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  // 有了 reduxthunk 的幫助，我們可以在 async function 結束後再 dispatch action
  dispatch({
    type: FETCH_USER,
    payload: res.data,
  });
};

export const handleToken = token => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);
  dispatch({
    type: FETCH_USER,
    payload: res.data,
  });
};

export const submitSurvey = (values, history) => async(dispatch) => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys'); // 用 history 來 redirect 頁面
  
  dispatch({
    type: FETCH_USER,
    payload: res.data,
  })
}

export const fetchSurveys = () => async(dispatch) => {
  const res = await axios.get('/api/surveys');
  dispatch({
    type: FETCH_SURVEYS,
    payload: res.data
  });
}