import NGraph from 'ngraph.graph';
import NGraphForceLayout from 'ngraph.forcelayout';
import raf from 'raf';

const defaultOptions = {
  stableMomemtumDiff: 0.003,
  physicsSetting: {
    springLength: 90,
    springCoeff: 0.0001,
    gravity: -1.2,
    theta: 0.3,
    dragCoeff: 0.01,
    timeStep: 20
  }
};

export default class NGraphForce {

  constructor() {
    this._options = defaultOptions;
    // custom layout data structure
    this._ngraph = NGraph();
    this._lastMomemtum = 0;
    // initialize layout engine
    this._simulator = NGraphForceLayout(
      this._ngraph,
      this._options.physicsSetting
    );
  }

  _ticked = () => {
    this._lastMomemtum = this._simulator.lastMove;
    if (this._onUpdate) {
      this._onUpdate();
    }
  };

  registerCallbacks(onUpdate) {
    this._onUpdate = onUpdate;
  }

  unregisterCallbacks() {
    this._simulator.dispose();
    this._onUpdate = null;
    this._onDone = null;
  }

  _frame = () => {
    this._simulator.step();
    // check if the layout is stable
    const {stableMomemtumDiff} = this._options;
    const momemtumDiff = Math.abs(
      this._simulator.lastMove - this._lastMomemtum
    );
    const isStable = momemtumDiff <= stableMomemtumDiff;
    // trigger callbacks
    this._ticked();

    if (!isStable) {
      // request animation frame
      raf(this._frame);
    }
  };

  start() {
    if (this._ngraph.getNodesCount() === 0) {
      return;
    }
    // request animation frame
    raf(this._frame);
  }

  update(graph) {
    const _ngraph = this._ngraph;
    // remove non-exist node
    this._ngraph.forEachNode(nNode => {
      const node = graph.findNode(nNode.id);
      if (!node) {
        this._ngraph.removeNode(nNode.id);
      }
    });
    // add new nodes
    graph.nodes.forEach(node => {
      const nNode = this._ngraph.getNode(node.id);
      if (!nNode) {
        // add new node
        const newNode = _ngraph.addNode(node.id);
        // set to origin
        this._simulator.setNodePosition(node.id, 0, 0);
      }
    });

    // remove non-exist edge
    this._ngraph.forEachLink(nEdge => {
      const edgeId = nEdge.data;
      if (!graph.findEdge(edgeId)) {
        this._ngraph.removeLink(nEdge);
      }
    });
    graph.edges.forEach(edge => {
      const nEdge = this._ngraph.getLink(edge.source, edge.target);
      if (!nEdge) {
        // add new edge
        _ngraph.addLink(edge.source, edge.target, edge.id);
      }
    });
  }

  alpha() {
    return this._lastMomemtum;
  }

  getNodePosition = node => {
    const nNodePos = this._simulator.getNodePosition(node.id);
    return [nNodePos.x, nNodePos.y];
  };

  getEdgePosition = edge => {
    const sourceNodePos = this._simulator.getNodePosition(edge.source);
    const targetNodePos = this._simulator.getNodePosition(edge.target);
    return {
      sourcePosition: [sourceNodePos.x, sourceNodePos.y],
      targetPosition: [targetNodePos.x, targetNodePos.y]
    };
  };
}
