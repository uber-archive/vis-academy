import React from 'react';
import App from '../demos/linking-it-all/app.js';

function Hero() {
  return (<div className="Hero"
    style={{
      color: '#494949',
      height: '35vh',
      overflow: 'hidden',
      padding: 0,
      position: 'relative'
    }}
  >
    <App 
      noControls={true}
      viewport={{
        longitude: -73.97716964761271,
        latitude: 40.62291914445337,
        zoom: 10.745105428567754,
        maxZoom: 16,
        bearing: -31.958762886597924,
        pitch: 36.3576011413799
      }}
    />
  </div>);
}

export default Hero;
