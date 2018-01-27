import React from 'react';
import {render} from 'react-dom';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import {document} from 'global';

import AppContainer from './src/container';
import reducer from './src/reducer';
import 'antd/dist/antd.css';

const store = createStore(reducer);

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
