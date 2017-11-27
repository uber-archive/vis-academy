import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {reducer} from './reducer';
import App from './app-container';

let store = createStore(reducer);

export default function provider() {
  return (<Provider store={store}>
      <App />
    </Provider>);
}
