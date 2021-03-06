/* eslint-disable */
import 'materialize-css/dist/css/materialize.min.css'
// import our css file from node-modules, if we are not using relative path, webpack automatically assume we are import our file from NPM node module
// because we do not need to assign this css file to a variable, we can simply our import statement

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers'

// Development only axios helpers!
import axios from 'axios';
window.axios = axios;

const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}> <App /> </Provider>,
  document.querySelector('#root')
);