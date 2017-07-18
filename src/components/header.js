import React, {Component} from 'react';

// TODO/xiaoji move to a GitHub file?
export const LIBRARIES = {
  'Visualization Tutorials': '#',
  'react-map-gl': 'https://uber.github.io/react-map-gl',
  'deck.gl': 'https://uber.github.io/deck.gl',
  'luma.gl': 'https://uber.github.io/luma.gl',
  'react-vis': 'https://uber.github.io/react-vis'
};

export default class Header extends Component {

  _renderLinks() {
    return (
      <div className="site-links">
        {Object.keys(LIBRARIES).map((name) =>
          <div key={name} className="site-link">
            <a href={LIBRARIES[name]}>{name}</a>
          </div>)}
      </div>
    );
  }

  render() {
    return (
      <header>
        <div className="bg" />
        <div className="container">
          { this._renderLinks() }
        </div>
      </header>
    );
  }
}
