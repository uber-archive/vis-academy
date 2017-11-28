/* setup.js */
import 'babel-polyfill';
import JSDOM from 'jsdom';
const Adapter = require('enzyme-adapter-react-15');
const { configure } = require('enzyme');

require('jsdom-global')();

configure({ adapter: new Adapter() });
