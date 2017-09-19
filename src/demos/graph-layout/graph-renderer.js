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
      getNodePosition,
      getNodeSize,
      getNodeColor
    } = this.props;

    return new ScatterplotLayer({
      id: 'node-layer',
      data: nodes,
      getPosition: node => getNodePosition(node),
      // getPosition: getNodePosition,
      // ^^^ this doesn't work?
      getRadius: getNodeSize,
      getColor: getNodeColor,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: alpha
      }
    });
  }

  _renderEdgeLayer() {
    const {
      alpha,
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
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: () => {
          console.log('edge update triggered');
          return alpha;
        },
        getTargetPosition: () => {
          console.log('edge update triggered');
          return alpha;
        }
      }
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
      <div id="graph-renderer">
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
