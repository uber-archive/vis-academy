/* global document */
import React from 'react';
import {render} from 'react-dom';
import App from './src/provider';

const Root = () => (
  <div className="app-container"><App/></div>
);

render(<Root />, document.body.appendChild(document.createElement('div')));
