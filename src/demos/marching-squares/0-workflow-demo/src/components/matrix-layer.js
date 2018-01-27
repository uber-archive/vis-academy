import {LineLayer, CompositeLayer, COORDINATE_SYSTEM} from 'deck.gl';

const DEFAULT_COL_SIZE = 4;
const DEFAULT_ROW_SIZE = 4;
const DEFAULT_MATRIX_WIDTH = 0;
const DEFAULT_MATRIX_HEIGHT = 0;
const OFFSET = 0.5;
const MASK_COLOR = [255, 255, 255, 96];

const defaultProps = {
  id: 'default-matrix-layer',
  data: [],
  filters: {},
  selected: null,
  layout: {
    x: 0,
    y: 0,
    dx: DEFAULT_COL_SIZE,
    dy: DEFAULT_ROW_SIZE,
    width: DEFAULT_MATRIX_WIDTH,
    height: DEFAULT_MATRIX_HEIGHT
  },
  coordinateSystem: COORDINATE_SYSTEM.IDENTITY,
  // left-top
  getPosition: d => [0, 0, 0],
  getColor: d => [0, 128, 0],
  getAltColor: d => [128, 0, 0]
};

class MatrixLayer extends CompositeLayer {
  _renderMatrixCells() {
    const {
      id,
      data,
      filters,
      layout: {x, y, dx, dy},
      coordinateSystem,
      getPosition,
      getColor,
      getAltColor,
      onHover,
      onClick
    } = this.props;

    return new LineLayer({
      id: `${id}-cells`,
      data,
      strokeWidth: dy * 2,
      pickable: Boolean(onHover || onClick),
      coordinateSystem,
      getSourcePosition: d => {
        const p = getPosition(d);
        return [x + p[0], y + p[1] + dy / 2];
      },
      getTargetPosition: d => {
        const p = getPosition(d);
        return [x + p[0] + dx, y + p[1] + dy / 2];
      },
      getColor: d => {
        const selected = Object.keys(filters).reduce((sel, key) => {
          const filter = filters[key];
          if (filter.type === 'EQUAL') {
            return (sel |= filter.values.indexOf(d[key]) >= 0);
          } else if (filter.type === 'RANGE') {
            return (sel |= d[key] >= filter.values[0] && d[key] <= filter.values[1]);
          }
          return sel;
        }, false);
        return selected ? getAltColor(d) : getColor(d);
      },
      onHover,
      onClick,
      updateTriggers: {
        getColor: Object.values(filters).join('-')
      }
    });
  }

  _renderMatrixBorder() {
    const {id, layout: {x, y, width, height}, coordinateSystem} = this.props;

    return new LineLayer({
      id: `${id}-border`,
      data: [
        {
          source: [x - OFFSET, y - OFFSET],
          target: [x + width + OFFSET, y - OFFSET]
        },
        {
          source: [x - OFFSET, y - OFFSET],
          target: [x - OFFSET, y + height + OFFSET]
        },
        {
          source: [x + width + OFFSET, y - OFFSET],
          target: [x + width + OFFSET, y + height + OFFSET]
        },
        {
          source: [x - OFFSET, y + height + OFFSET],
          target: [x + width + OFFSET, y + height + OFFSET]
        }
      ],
      coordinateSystem,
      getSourcePosition: d => d.source,
      getTargetPosition: d => d.target,
      getColor: d => [64, 64, 64]
    });
  }

  // a faster way for highlighting selection comparing to element-wise checking
  // ---------------------
  // |           |       |
  // |    A      |   B   |  A and B share same height / strokeWidth
  // |           |       |
  // |========== p ======|
  // |    C      |   D   |  C and D share same height / strokeWidth
  // ---------------------
  _renderMatrixMasks() {
    const {
      id,
      selected,
      layout: {x, y, dx, dy, width, height},
      coordinateSystem,
      getPosition
    } = this.props;

    if (!selected) {
      return [];
    }

    const [px, py] = getPosition(selected);
    const x0 = x;
    const x1 = x + px;
    const x2 = x + px + dx;
    const x3 = x + width;
    const y0 = y + py / 2;
    const y1 = y + height - (height - py - dy) / 2;

    const AB = [
      {sourcePosition: [x0, y0], targetPosition: [x1, y0]},
      {sourcePosition: [x2, y0], targetPosition: [x3, y0]}
    ];
    const CD = [
      {sourcePosition: [x0, y1], targetPosition: [x1, y1]},
      {sourcePosition: [x2, y1], targetPosition: [x3, y1]}
    ];

    return [
      new LineLayer({
        id: `${id}-mask-top`,
        data: AB,
        coordinateSystem,
        getColor: d => MASK_COLOR,
        strokeWidth: py * 2
      }),
      new LineLayer({
        id: `${id}-mask-bottom`,
        data: CD,
        coordinateSystem,
        getColor: d => MASK_COLOR,
        strokeWidth: (height - py - dy) * 2
      })
    ];
  }

  renderLayers() {
    const {layout: {width, height}} = this.props;
    if (width <= 0 || height <= 0) {
      return [];
    }
    return [this._renderMatrixBorder(), this._renderMatrixCells(), this._renderMatrixMasks()];
  }
}

MatrixLayer.layerName = 'MatrixLayer';
MatrixLayer.defaultProps = defaultProps;

export default MatrixLayer;
