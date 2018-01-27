import {createSelector} from 'reselect';
import {CANVAS_PADDING, PANEL_PADDING} from './constants';

const rootSelector = state => state;

export const getCurrentStep = createSelector(rootSelector, state => state.currentStep);

export const getScreenWidth = createSelector(rootSelector, root => root.width);
export const getScreenHeight = createSelector(rootSelector, root => root.height);

export const getNumCol = createSelector(rootSelector, root => root.numCol);
export const getNumRow = createSelector(rootSelector, root => root.numRow);

export const getRawDataPoints = createSelector(rootSelector, state => state.data);

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

export const getMatrixHeatmap = createSelector(
  [getNumCol, getNumRow, getRawDataPoints],
  (numCol, numRow, points) => {
    return points.reduce((heatmap, [x, y]) => {
      const col = Math.floor(x * numCol);
      const row = Math.floor(y * numRow);
      const key = `${col}-${row}`;
      if (heatmap[key] > 0) {
        heatmap[key] += 1;
      } else {
        heatmap[key] = 1;
      }
      return heatmap;
    }, {});
  }
);

export const getMaxCount = createSelector(getMatrixHeatmap, heatmap =>
  Math.max(...Object.values(heatmap))
);

// export const getNormalizedMatrixHeatmap = createSelector([getMatrixHeatmap, ])

export const getNormalizedMatrixData = createSelector(
  [getMatrixHeatmap, getMaxCount],
  (heatmap, maxCount) => {
    return Object.keys(heatmap).map(key => {
      const [col, row] = key.split('-').map(Number);
      return {
        col,
        row,
        val: heatmap[key] / maxCount || 1e10
      };
    });
  }
);

export const getDiscretizedMatrixData = createSelector([getNormalizedMatrixData], data => {
  return data.map(d => ({...d, val: d.val > 0.5 ? 1 : 0}));
});

export const getMatrixData = createSelector(
  [getNormalizedMatrixData, getDiscretizedMatrixData, getCurrentStep],
  (normalizedData, discretizedData, currentStep) => {
    return currentStep === 2 ? discretizedData : normalizedData;
  }
);

export const getMatrixIndexMap = createSelector([getDiscretizedMatrixData], discretizedData => {});
