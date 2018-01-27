import React, {PureComponent} from 'react';

const DEFAULT_PROPS = {
  width: 0,
  height: 0,
  numCol: 10,
  numRow: 10,
  data: null
};

class Matrix extends PureComponent {
  renderCells() {
    const {width, height, numCol, numRow, data} = this.props;
    if (numCol <= 0 || numRow <= 0 || !data || data.length === 0) {
      return null;
    }

    const dx = width / numCol;
    const dy = height / numRow;

    const cells = data.map(d => {
      const key = `${d.col}-${d.row}`;
      return (
        <rect
          key={key}
          x={dx * d.col + 1}
          y={dy * d.row + 1}
          width={dx - 2}
          height={dy - 2}
          rx={2}
          ry={2}
          fill={'#FEA'}
        />
      );
    });

    return <g>{cells}</g>;
  }

  render() {
    const {width, height} = this.props;
    if (width <= 0 || height <= 0) {
      return null;
    }

    return (
      <svg width={width} height={height}>
        {this.renderCells()}
      </svg>
    );
  }
}

Matrix.displayName = 'Matrix';
Matrix.defaultProps = DEFAULT_PROPS;

export default Matrix;
