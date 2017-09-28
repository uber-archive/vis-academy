import React, {PureComponent} from 'react';

import DeckGL from 'deck.gl';

export default class GraphRender extends PureComponent {

  render() {
    const layers = [];
    return (
      <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          layers={layers}
        />
      </div>
    );
  }
}
