
export default class Graph {
  constructor(graph = null) {
    this.nodes = (graph && graph.nodes) || [];
    this.edges = (graph && graph.edges) || [];
    this._nodeMap = (graph && graph._nodeMap) || {};
    this._edgeMap = (graph && graph._edgeMap) || {};
  }

  addNode(node) {
    this.nodes.push(node);
    this._nodeMap[node.id] = node;
  }

  addEdge(edge) {
    this.edges.push(edge);
    this._edgeMap[edge.id] = edge;
  }

  removeNode(id) {
    this.nodes = this.nodes.filter(node => node.id !== id);
    this._nodeMap[id] = null;
  }

  removeEdge(id) {
    this.edges = this.edges.filter(edge => edge.id !== id);
    this._edgeMap[id] = null;
  }

  findNode(id) {
    return this._nodeMap[id];
  }

  findEdge(id) {
    return this._edgeMap[id];
  }

  findConnectedEdges(id) {
    return this.edges.filter(e => e.source === id || e.target === id);
  }

  getDegree(id) {
    return this.findConnectedEdges(id).length;
  }

  resetNodes() {
    this.nodes = [];
    this._nodeMap = {};
  }

  resetEdges() {
    this.edges = [];
    this._edgeMap = {};
  }

  reset() {
    this.resetNodes();
    this.resetEdges();
  }

  isEmpty() {
    return !this.nodes || !this.nodes.length;
  }
}
