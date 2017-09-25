import React, {PureComponent} from 'react';

import DeckGL, {
  LineLayer,
  ScatterplotLayer,
  OrthographicViewport,
  COORDINATE_SYSTEM
} from 'deck.gl';

export default class GraphRender extends PureComponent {

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
      getNodeSize,
      // update triggers
      positionUpdateTrigger
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
        getPosition: positionUpdateTrigger
      }
    });
  }

  renderEdgeLayer() {
    const {
      edges,
      getEdgeColor,
      getEdgePosition,
      getEdgeWidth,
      // update triggers
      positionUpdateTrigger
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
        getSourcePosition: positionUpdateTrigger,
        getTargetPosition: positionUpdateTrigger
      }
    });
  }

  render() {
    const {height, width} = this.props;

    return (
      <div id="graph-render">
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
