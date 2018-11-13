import React, { Component } from 'react';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/light-v9';
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

function SetToken() {
  return (
    <div style={{fontSize: '20px'}}>
      <div>You don't have a Mapbox token set in your environemnt.</div>
      <ul>
        <li>
          Go to <a href="http://mapbox.com">Mapbox</a> and log in or sign up to
          get a token.
        </li>
        <li>Copy the token to your clipboard.</li>
        <li>Stop this app in the terminal (ctrl+c)</li>
        <li>
          <p>type: </p>
          <p>
            <code>export MapboxAccessToken="</code>, then paste your token, then
            type a closing ".
          </p>{' '}
          ie <code>export MapboxAcessToken="pk.123456"</code>
        </li>
        <li>
          Restart the app from the terminal (<code>yarn start</code>)
        </li>
      </ul>
    </div>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="intro">
          {MAPBOX_TOKEN ? (
            `You mapbox token is set. You're good to go!`
          ) : (
            <SetToken />
          )}
        </div>
      </div>
    );
  }
}
