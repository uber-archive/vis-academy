import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends PureComponent {

  createViewport() {
    const width = this.props.width;
    const height = this.props.height;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }

  renderNodeLayer() {
    return new ScatterplotLayer({
      id: 'node-layer',
      data: this.props.nodes,
      getPosition: this.props.getNodePosition,
      getRadius: this.props.getNodeSize,
      getColor: this.props.getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  renderEdgeLayer() {
    return new LineLayer({
      id: 'edge-layer',
      data: this.props.edges,
      getSourcePosition: e => this.props.getEdgePosition(e).sourcePosition,
      getTargetPosition: e => this.props.getEdgePosition(e).targetPosition,
      getColor: this.props.getEdgeColor,
      strokeWidth: this.props.getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  render() {
    return (
      <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          viewport={this.createViewport()}
          layers={[
            this.renderEdgeLayer(),
            this.renderNodeLayer()
          ]}
        />
      </div>
    );
  }
}
