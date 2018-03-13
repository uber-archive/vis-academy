import React from 'react';

export const PROJECT_TYPE = 'github'; // 'github' || 'phab'

export const PROJECT_NAME = 'vis-academy';
export const PROJECT_ORG = 'uber-common';
export const PROJECT_URL = `https://github.com/${PROJECT_ORG}/${PROJECT_NAME}`;
export const PROJECT_DESC = 'An introduction to Uber Visualization libraries.';

export const PROJECTS = {
  'deck.gl': 'https://uber.github.io/deck.gl',
  'luma.gl': 'https://uber.github.io/luma.gl',
  'react-map-gl': 'https://uber.github.io/react-map-gl',
  'react-vis': 'https://uber.github.io/react-vis',
};

export const HOME_RIGHT = (
  <div>
    <h2>Uber Visualization tutorial</h2>
    <p className='m-bottom'>
      This tutorial will show you how to build an app that showcases three of Uber visualization libraries: ReactMapGL for maps, DeckGL to create WebGL-based data overlays and React-Vis for simple charts.
      </p>
    <p className='m-bottom'>
      You will learn how to use these libraries separately, but also how they can be combined to work together.
    </p>
  </div>
);

export const HOME_BULLETS = [{
  text: 'React-friendly',
  img: 'images/icon-react.svg',
}, {
  text: 'Learn the vis stack',
  img: 'images/icon-layers.svg',
}];
export const GA_TRACKING = 'UA-64694404-18';
export const ADDITIONAL_LINKS = []
