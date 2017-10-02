import React, {Component} from 'react';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

export default class DeckGLOverlay extends Component {

  render() {
    if (!this.props.data) {
      return null;
    }

    return <div/>;

  }
}