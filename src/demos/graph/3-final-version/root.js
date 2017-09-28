import React from 'react';
import {render} from 'react-dom';

import App from './src/app';

const element = document.getElementById('root');

render(<App />, element);

if (module.hot) {
  module.hot.accept('./src/app', () => {
    const Next = require('./src/app').default;
    render(<Next />, element);
  });
}
