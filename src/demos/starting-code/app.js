/* global window */
import React, {Component} from 'react';

const MAPBOX_STYLE = 'mapbox://styles/uberdata/cive485h000192imn6c6cc8fc';
// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default class App extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='p2'>Empty App, Edit Me!</div>
    );
  }
}
