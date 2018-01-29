import {createSelector} from 'reselect';
import {CANVAS_PADDING, PANEL_PADDING} from './constants';
import {allocBuffer} from './utils';

const rootSelector = state => state;

export const getCurrentStep = createSelector(rootSelector, state => state.currentStep);

export const getScreenWidth = createSelector(rootSelector, root => root.width);
export const getScreenHeight = createSelector(rootSelector, root => root.height);

export const getNumCol = createSelector(rootSelector, root => root.numCol);
export const getNumRow = createSelector(rootSelector, root => root.numRow);

export const getRawPixelBuffer = createSelector(rootSelector, state => state.pixelBuffer);
export const getRawDataPoints = createSelector(rootSelector, state => state.dataPoints);

export const getContentPanelSize = createSelector(
  [getScreenWidth, getScreenHeight],
  (width, height) => {
    return {
      width: (width - CANVAS_PADDING * 2) / 2,
      height: height - CANVAS_PADDING * 2
    };
  }
);

export const getSiderWidth = createSelector(
  [getScreenWidth, getContentPanelSize],
  (screenWidth, {width, height}) => screenWidth - CANVAS_PADDING * 2 - width
);

export const getMatrixLayout = createSelector(
  [getContentPanelSize, getNumCol, getNumRow],
  ({width, height}, numCol, numRow) => {
    const size = Math.min(width - PANEL_PADDING * 2, height - PANEL_PADDING * 2);
    return {
      x: 0,
      y: 0,
      dx: size / numCol,
      dy: size / numRow,
      width: size,
      height: size
    };
  }
);

export const getMatrixSize = createSelector(
  getContentPanelSize,
  ({width, height}) => Math.min(width, height) - PANEL_PADDING * 2
);

export const getProjectedPointData = createSelector(
  [getRawDataPoints, getMatrixSize],
  (points, size) => {
    return points.map(d => ({
      position: [d[0] * size, d[1] * size]
    }));
  }
);

// DATA - need to rewwrite in a more low-level way for parity of glsl implementations

export const getBuffer = createSelector(
  [getRawDataPoints, getNumCol, getNumRow],
  (points, numCol, numRow) => {
    const buffer = allocBuffer(numCol * numRow);
    points.forEach(([x, y]) => {
      if (x >= 0 && y >= 0 && x <= 1 && y <= 1) {
        const col = Math.floor(x * numCol);
        const row = Math.floor(y * numRow);
        const idx = col + row * numCol;
        buffer[idx] += 1;
      }
    });
    return buffer;
  }
);

export const getMaxValueInPixelBuffer = createSelector(getBuffer, buffer =>
  Math.max(...Object.values(buffer))
);

export const getNormalizedPixelBuffer = createSelector(
  [getBuffer, getMaxValueInPixelBuffer],
  (buffer, maxValue) => {
    if (!maxValue) {
      return buffer;
    }
    return buffer.map(d => d / maxValue);
  }
);

export const getQuantizedBuffer = createSelector(getNormalizedPixelBuffer, buffer =>
  buffer.map(d => (d > 0.5 ? 1 : 0))
);

export const getQuantizedBufferOffsetX = createSelector(
  [getQuantizedBuffer, getNumCol],
  (buffer, numCol) =>
    buffer.map((_, idx) => {
      const col = idx % numCol;
      if (col === numCol - 1) {
        return 0;
      }
      return buffer[idx + 1];
    })
);

export const getQuantizedBufferOffsetY = createSelector(
  [getQuantizedBuffer, getNumCol, getNumRow],
  (buffer, numCol, numRow) =>
    buffer.map((_, idx) => {
      const row = Math.floor(idx / numRow);
      if (row === numRow - 1) {
        return 0;
      }
      return buffer[idx + numCol];
    })
);

export const getQuantizedBufferOffsetXY = createSelector(
  [getQuantizedBuffer, getNumCol, getNumRow],
  (buffer, numCol, numRow) => {
    return buffer.map((_, idx) => {
      const col = idx % numCol;
      const row = Math.floor(idx / numCol);
      if (col === numCol - 1 || row === numRow - 1) {
        return 0;
      }
      return buffer[col + 1 + (row + 1) * numCol];
    });
  }
);

export const getMatrixCellShapeIndices = createSelector(
  [
    getQuantizedBuffer,
    getQuantizedBufferOffsetX,
    getQuantizedBufferOffsetXY,
    getQuantizedBufferOffsetY,
    getNumCol,
    getNumRow
  ],
  (buffer, bufferX, bufferXY, bufferY, numCol, numRow) => {
    const shapeIndices = [];
    for (let row = 0; row < numRow - 1; row++) {
      for (let col = 0; col < numCol - 1; col++) {
        const index = col + row * numCol;
        const shapeIndex =
          buffer[index] * 8 + bufferX[index] * 4 + bufferXY[index] * 2 + bufferY[index];
        shapeIndices.push(shapeIndex);
      }
    }
    return shapeIndices;
  }
);

// for rendering

export const getMatrixCellShapeLabels = createSelector(
  [getMatrixCellShapeIndices, getNumCol],
  (shapeIndices, numCol) =>
    shapeIndices.map((val, idx) => ({
      col: idx % (numCol - 1),
      row: Math.floor(idx / (numCol - 1)),
      val
    }))
);

export const getNormalizedMatrixData = createSelector(
  [getNormalizedPixelBuffer, getNumCol],
  (buffer, numCol) =>
    buffer.map((val, idx) => ({
      col: idx % numCol,
      row: Math.floor(idx / numCol),
      val
    }))
);

export const getQuantizedMatrixData = createSelector(
  [getQuantizedBuffer, getNumCol],
  (buffer, numCol) =>
    buffer.map((val, idx) => ({
      col: idx % numCol,
      row: Math.floor(idx / numCol),
      val
    }))
);

export const getMatrixData = createSelector(
  [getNormalizedMatrixData, getQuantizedMatrixData, getCurrentStep],
  (normalizedData, quantizedData, currentStep) =>
    currentStep >= 2 ? quantizedData : normalizedData
);
