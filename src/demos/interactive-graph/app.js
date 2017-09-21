/* global window */
import React, { Component } from 'react'

// data
import SAMPLE_GRAPH from '../data/sample-graph2'
// components
import Graph from './graph'
import GraphRenderer from './graph-renderer'
import LayoutEngine from './layout-engine'

export default class App extends Component {
  constructor(props) {
    super(props)
    const width = window.innerWidth
    const height = window.innerHeight
    this.state = {
      viewport: { width, height },
      hoveredNodeID: null,
    }

    this._engine = new LayoutEngine()
  }

  componentWillMount() {
    this._engine.registerCallbacks({
      onUpdate: this._reRender,
    })
    this.processData()
  }

  componentWillUnmount() {
    this._engine.unregisterCallbacks()
  }

  reRender = () => {
    this.forceUpdate()
  }

  processData = () => {
    this._graph = new Graph()
    // load data
    if (SAMPLE_GRAPH) {
      const { viewport } = this.state
      const { width, height } = viewport
      SAMPLE_GRAPH.nodes.forEach(node => {
        this._graph.addNode({
          id: node.id,
          isHighlighted: false,
        })
      })
      SAMPLE_GRAPH.edges.forEach(edge => {
        this._graph.addEdge({
          ...edge,
          isHighlighted: false,
        })
      })
      // update engine
      this._engine.update(this._graph)
      this._engine.start()
    }
  }

  // node accessors
  getNodeColor = node => {
    return node.isHighlighted ? [256, 0, 0] : [94, 94, 94]
  }

  getNodeSize = node => 10

  onHoverNode = node => {
    // check if is hovering on a node
    const isHoveringOnNode = node.object !== undefined
    if (isHoveringOnNode) {
      // highlight the selected node and connected edges
      const hoveredNodeID = node.object.id
      node.object.isHighlighted = true
      const connectedEdges = this._graph.findConnectedEdges(hoveredNodeID)
      connectedEdges.forEach(e => {
        e.isHighlighted = true
      })
      // update component state
      this.setState({ hoveredNodeID })
    } else {
      // unset highlighted nodes and edges
      const { hoveredNodeID } = this.state
      const node = this._graph.findNode(hoveredNodeID)
      node.isHighlighted = false
      const connectedEdges = this._graph.findConnectedEdges(hoveredNodeID)
      connectedEdges.forEach(e => {
        e.isHighlighted = false
      })
      // update component state
      this.setState({ hoveredNodeID: null })
    }
  }

  // edge accessors
  getEdgeColor = edge => (edge.isHighlighted ? [256, 0, 0] : [64, 64, 64])

  getEdgeWidth = () => 2

  render() {
    if (this._graph.isEmpty()) {
      return null
    }

    const { viewport, hoveredNodeID } = this.state
    return (
      <GraphRenderer
        width={viewport.width}
        height={viewport.height}
        positionUpdateTrigger={this._engine.alpha()}
        colorUpdateTrigger={hoveredNodeID}
        nodes={this._graph.nodes}
        getNodeColor={this.getNodeColor}
        getNodeSize={this.getNodeSize}
        getNodePosition={this._engine.getNodePosition}
        onHoverNode={this.onHoverNode}
        edges={this._graph.edges}
        getEdgeColor={this.getEdgeColor}
        getEdgeWidth={this.getEdgeWidth}
        getEdgePosition={this._engine.getEdgePosition}
      />
    )
  }
}
