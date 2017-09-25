import * as d3 from 'd3-force';

const defaultOptions = {
  alpha: 0.3,
  edgeStrength: 1,
  nBodyStrength: -900,
  nBodyDistanceMin: 100,
  nBodyDistanceMax: 400,
  pickingRange: 20
};

export default class LayoutEngine {

  constructor(props) {
    // custom graph data
    this._d3Graph = {nodes: [], edges: []};
    this._nodeMap = {};
    this._edgeMap = {};
    // instantiate d3 force layout simulator
    const {nBodyStrength, nBodyDistanceMin, nBodyDistanceMax} = defaultOptions;
    const g = this._d3Graph;
    this._simulator = d3
      .forceSimulation(g.nodes)
      .force(
        'edge',
        d3
          .forceLink(g.edges)
          .id(n => n.id)
          .strength(this._strength)
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength(nBodyStrength)
          .distanceMin(nBodyDistanceMin)
          .distanceMax(nBodyDistanceMax)
      )
      .force("center", d3.forceCenter());
    this._simulator.on('tick', this.ticked);
  }

  ticked = () => {
    if (this._onUpdateCallback) {
      this._onUpdateCallback();
    }
  }

  _strength = d3Edge => {
    const sourceDegree = this._graph.getDegree(d3Edge.source.id);
    const targetDegree = this._graph.getDegree(d3Edge.target.id);
    return 1 / Math.min(sourceDegree, targetDegree, 1);
  }

  registerCallbacks(onUpdate) {
    this._onUpdateCallback = onUpdate;
  }

  unregisterCallbacks() {
    this._onUpdateCallback = null;
    this._simulator.on('tick', null);
  }

  start() {
    const {alpha} = defaultOptions;
    this._simulator.nodes(this._d3Graph.nodes).force(
      'edge',
      d3
        .forceLink(this._d3Graph.edges)
        .id(n => n.id)
        .strength(this._strength)
    );
    this._simulator.alpha(alpha).restart();
  }

  update(graph) {
    this._graph = graph;
    // update internal layout data
    // nodes
    const newNodeMap = {};
    const newD3Nodes = graph.nodes.map(node => {
      const oldD3Node = this._nodeMap[node.id];
      const newD3Node = oldD3Node
        ? oldD3Node
        : {id: node.id};
      newNodeMap[node.id] = newD3Node;
      return newD3Node;
    });
    this._nodeMap = newNodeMap;
    this._d3Graph.nodes = newD3Nodes;
    // edges
    const newEdgeMap = {};
    const newD3Edges = graph.edges.map(edge => {
      const oldD3Edge = this._edgeMap[edge.id];
      const newD3Edge = oldD3Edge
        ? oldD3Edge
        : {
            id: edge.id,
            source: edge.source,
            target: edge.target
          };
      newEdgeMap[edge.id] = newD3Edge;
      return newD3Edge;
    });
    this._edgeMap = newEdgeMap;
    this._d3Graph.edges = newD3Edges;
  }

  alpha = () => this._simulator.alpha()

  getNodePosition = node => {
    const d3Node = this._nodeMap[node.id];
    if (d3Node) {
      return [d3Node.x, d3Node.y];
    }
    return [0, 0];
  }

  getEdgePosition = edge => {
    const d3Edge = this._edgeMap[edge.id];
    if (d3Edge) {
      return {
        sourcePosition: [d3Edge.source.x, d3Edge.source.y],
        targetPosition: [d3Edge.target.x, d3Edge.target.y]
      };
    }
    return {
      sourcePosition: [0, 0],
      targetPosition: [0, 0]
    };
  }
}
