import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRenderer extends PureComponent {

  creatViewport() {
    const {height, width} = this.props;
    return new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
    });
  }

  renderNodeLayer() {
    const {
      nodes,
      getNodeColor,
      getNodePosition,
      getNodeSize
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: getNodePosition,
      getRadius: getNodeSize,
      getColor: getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  renderEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth
    } = this.props;

    return new LineLayer({
      id: 'edge-layer',
      data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  render() {
    const {height, width} = this.props;
    
    return (
      <div id="graph-renderer">
        <DeckGL
          width={width}
          height={height}
          viewport={this.creatViewport()}
          layers={[
            this.renderEdgeLayer(),
            this.renderNodeLayer()
          ]}
        />
      </div>
    );
  }
}
