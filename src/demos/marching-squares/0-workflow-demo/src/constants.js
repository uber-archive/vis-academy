export const CANVAS_PADDING = 48;
export const PANEL_PADDING = 24;

export const STEPS = [
  {description: 'generate random data points: five gaussian distributions'},
  {description: 'generate a heatmap based on the given points'},
  {description: 'binarize the heatmap given a threshold value'},
  {description: 'get the hash code from the lookup label'},
  {description: 'replace the code with line segments'}
];

// TODO: use 0.5 for now, should allow specify distance
const VERTEX = {
  N: [0, -0.5],
  E: [0.5, 0],
  S: [0, 0.5],
  W: [-0.5, 0]
};

export const CONTOUR_SHAPE_MAP = {
  0: [],
  1: [[VERTEX.W, VERTEX.S]],
  2: [[VERTEX.S, VERTEX.E]],
  3: [[VERTEX.W, VERTEX.E]],
  4: [[VERTEX.N, VERTEX.E]],
  5: [[VERTEX.W, VERTEX.N], [VERTEX.S, VERTEX.E]],
  6: [[VERTEX.N, VERTEX.S]],
  7: [[VERTEX.W, VERTEX.N]],
  8: [[VERTEX.W, VERTEX.N]],
  9: [[VERTEX.N, VERTEX.S]],
  10: [[VERTEX.W, VERTEX.S], [VERTEX.N, VERTEX.E]],
  11: [[VERTEX.N, VERTEX.E]],
  12: [[VERTEX.W, VERTEX.E]],
  13: [[VERTEX.S, VERTEX.E]],
  14: [[VERTEX.W, VERTEX.S]],
  15: []
};
