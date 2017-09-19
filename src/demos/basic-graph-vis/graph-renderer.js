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
      nodes,
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
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  _renderEdgeLayer() {
    const {
      edges,
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
      projectionMode: COORDINATE_SYSTEM.IDENTITY
    });
  }

  render() {
    const {height, width} = this.props;
    
    const glViewport = new OrthographicViewport({
      width,
      height,
      left: (-width / 2),
      top: (-height / 2)
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
