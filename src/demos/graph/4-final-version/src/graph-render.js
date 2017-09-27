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

  createNodeLayer() {
    return new ScatterplotLayer({
      id: 'node-layer',
      data: this.props.nodes,
      getPosition: node => this.props.getNodePosition(node),
      // getPosition: this.props.getNodePosition,
      getRadius: this.props.getNodeSize,
      getColor: this.props.getNodeColor,
      onHover: this.props.onHoverNode,
      pickable: true,
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getPosition: this.props.positionUpdateTrigger,
        getColor: this.props.colorUpdateTrigger
      }
    });
  }

  createEdgeLayer() {
    return new LineLayer({
      id: 'edge-layer',
      data: this.props.edges,
      getSourcePosition: e =>
        this.props.getEdgePosition(e).sourcePosition,
      getTargetPosition: e =>
        this.props.getEdgePosition(e).targetPosition,
      getColor: this.props.getEdgeColor,
      strokeWidth: this.props.getEdgeWidth(),
      projectionMode: COORDINATE_SYSTEM.IDENTITY,
      updateTriggers: {
        getSourcePosition: this.props.positionUpdateTrigger,
        getTargetPosition: this.props.positionUpdateTrigger,
        getColor: this.props.colorUpdateTrigger
      }
    });
  }

  render() {
    const {height, width} = this.props;
    return (
      <div id="graph-render">
        <DeckGL
          width={this.props.width}
          height={this.props.height}
          viewport={this.createViewport()}
          layers={[
            this.createEdgeLayer(),
            this.createNodeLayer()
          ]}
        />
      </div>
    );
  }
}
