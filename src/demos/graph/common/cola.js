import * as d3 from 'd3';
import {window} from 'global';
window.d3 = d3;
import {d3adaptor} from 'webcola';

const defaultOptions = {
  width: 900,
  height: 800,
  iteration: 30
};

export default class Cola {
  constructor() {
    this._options = defaultOptions;
    // custom layout data structure
    this._colaGraph = {nodes: [], edges: []};
    this._nodeMap = {};
    this._edgeMap = {};

    // initialize layout engineis
    const {width, height} = this._options;
    this._simulator = d3adaptor(d3).size([width / 2, height / 2]);
    // register event callbacks
    this._simulator.on('tick', this._ticked);
  }

  _ticked = () => {
    if (this._onUpdate) {
      this._onUpdate();
    }
  };

  registerCallbacks(onUpdate) {
    this._onUpdate = onUpdate;
  }

  unregisterCallbacks() {
    this._onUpdate = null;
    this._onDone = null;
    this._simulator.on('tick', null);
  }

  start() {
    if (this._colaGraph.nodes.length === 0) {
      return;
    }
    const iteration = this._options.iteration;
    const graph = this._colaGraph;
    this._simulator
      .nodes(graph.nodes)
      .links(graph.edges)
      .jaccardLinkLengths(100, 0.7)
      // .symmetricDiffLinkLengths(24)
      .handleDisconnected(false)
      .start(iteration);
  }

  update(graph) {
    // nodes
    const newNodeMap = {};
    const newColaNodes = graph.nodes.map(node => {
      const oldColaNode = this._nodeMap[node.id];
      const newColaNode = oldColaNode
        ? oldColaNode
        : {
            id: node.id,
            x: 0,
            y: 0
          };
      
      newNodeMap[node.id] = newColaNode;
      return newColaNode;
    });
    this._nodeMap = newNodeMap;
    this._colaGraph.nodes = newColaNodes;
    // edges
    const newEdgeMap = {};
    const newColaEdges = graph.edges.map(edge => {
      const newColaEdge = {
        id: edge.id,
        source: this._colaGraph.nodes.findIndex(n => n.id === edge.source),
        target: this._colaGraph.nodes.findIndex(n => n.id === edge.target)
      };
      newEdgeMap[edge.id] = newColaEdge;
      return newColaEdge;
    });
    this._edgeMap = newEdgeMap;
    this._colaGraph.edges = newColaEdges;
  }

  alpha() {
    return this._simulator.alpha();
  }

  getNodePosition = node => {
    const colaNode = this._nodeMap[node.id];
    if (colaNode) {
      return [colaNode.x, colaNode.y];
    }
    return [0, 0];
  };

  getEdgePosition = edge => {
    const colaEdge = this._edgeMap[edge.id];
    if (colaEdge) {
      return {
        sourcePosition: [colaEdge.source.x, colaEdge.source.y],
        targetPosition: [colaEdge.target.x, colaEdge.target.y]
      };
    }
    return {
      sourcePosition: [0, 0],
      targetPosition: [0, 0]
    };
  };
}
