import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRenderer extends PureComponent {

  constructor(props) {
    super(props);
    this._renderNodeLayer = this._renderNodeLayer.bind(this);
    this._renderEdgeLayer = this._renderEdgeLayer.bind(this);
  }

  _renderNodeLayer() {
    const {
      alpha,
      nodes,
      scale,
      getNodePosition,
      getNodeSize,
      getNodeColor
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: getNodePosition,
      getRadius: getNodeSize,
      getColor: getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: {alpha, scale}
      }
    });
  }

  _renderEdgeLayer() {
    const {
      alpha,
      edges,
      scale,
      getEdgePosition,
      getEdgeColor,
      getEdgeWidth
    } = this.props;

    return new LineLayer({
      id: 'edge-layer',
      data: edges,
      getSourcePosition: e => getEdgePosition(e).sourcePosition,
      getTargetPosition: e => getEdgePosition(e).targetPosition,
      getColor: getEdgeColor,
      strokeWidth: getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
          getSourcePosition: {alpha, scale},
          getTargetPosition: {alpha, scale}
        }
    });
  }

  render() {
    const {height, offset, scale, width} = this.props;
    
    const glViewport = new OrthographicViewport({
      width: width * scale,
      height: height * scale,
      left: (-width / 2 - offset.x) * scale,
      top: (-height / 2 - offset.y) * scale
    });

    return (
      <div
        id="graph-renderer"
        ref={interactionLayer => {
          this._container = interactionLayer;
        }}
        style={{pointerEvents: 'all'}}
      >
        <DeckGL
          width={width}
          height={height}
          viewport={glViewport}
          layers={[
            this._renderEdgeLayer(),
            this._renderNodeLayer()
          ]}
        />
      </div>
    );
  }
}
