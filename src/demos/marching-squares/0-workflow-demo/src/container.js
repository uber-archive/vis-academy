import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {window} from 'global';
import DeckGL, {ScatterplotLayer, OrthographicViewport, COORDINATE_SYSTEM} from 'deck.gl';
import {Button, Layout, Steps} from 'antd';
const {Content, Sider} = Layout;

// actions
import {updateViewport, updateCurrentStep} from './actions';
// selectors
import {
  getCurrentStep,
  getSiderWidth,
  getMatrixLayout,
  getMatrixData,
  getMatrixCellShapeLabels,
  getProjectedPointData
} from './selectors';
// components
import MatrixLayer from './components/matrix-layer';
// constants
import {CANVAS_PADDING, PANEL_PADDING, STEPS} from './constants';
// utils
import {getColor} from './utils';

const mapDispatchToProps = {
  updateViewport,
  updateCurrentStep
};

const mapStateToProps = state => ({
  currentStep: getCurrentStep(state),
  siderWidth: getSiderWidth(state),
  matrixLayout: getMatrixLayout(state),
  matrixData: getMatrixData(state),
  pointData: getProjectedPointData(state),
  matrixShapeIndices: getMatrixCellShapeLabels(state)
});

class AppContainer extends PureComponent {
  get style() {
    return {
      container: {
        display: 'inline-flex',
        width: '100vw',
        height: '100vh',
        padding: CANVAS_PADDING
      },
      navPanel: {
        backgroundColor: '#F8F8F8',
        padding: PANEL_PADDING
      },
      contentPanel: {
        backgroundColor: '#FFF',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
        padding: PANEL_PADDING,
        position: 'relative',
        zIndex: 1
      },
      prevButton: {
        position: 'absolute',
        bottom: PANEL_PADDING,
        left: PANEL_PADDING
      },
      nextButton: {
        position: 'absolute',
        bottom: PANEL_PADDING,
        right: PANEL_PADDING
      },
      innerContainer: {
        position: 'absolute',
        top: PANEL_PADDING,
        left: PANEL_PADDING
      }
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize.bind(this));
    this._handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize.bind(this));
  }

  _handleResize() {
    this.props.updateViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  _renderScatterplot() {
    const {pointData} = this.props;

    if (!pointData || pointData.length === 0) {
      return null;
    }

    return new ScatterplotLayer({
      id: 'scatterplot',
      data: pointData,
      coordinateSystem: COORDINATE_SYSTEM.IDENTITY
    });
  }

  _renderMatrix() {
    const {matrixData, matrixLayout} = this.props;
    const {dx, dy} = matrixLayout;

    if (!matrixData || matrixData.length === 0) {
      return null;
    }

    return new MatrixLayer({
      id: 'heatmap-matrix',
      data: matrixData,
      layout: matrixLayout,
      getPosition: d => [dx * d.col, dy * d.row],
      getColor: d => getColor(d.val)
    });
  }

  _renderQuantizedLabels() {
    const {matrixData, matrixLayout} = this.props;
    const {dx, dy} = matrixLayout;

    if (!matrixData || matrixData.length === 0) {
      return null;
    }

    const labels = matrixData.map((d, i) => {
      return (
        <text
          key={i}
          x={dx * d.col + dx / 2}
          y={dy * d.row + dy / 2}
          fill="#888"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
        >
          {d.val}
        </text>
      );
    });

    return <g>{labels}</g>;
  }

  _renderShapeIndexLabels() {
    const {matrixShapeIndices, matrixLayout} = this.props;
    const {dx, dy} = matrixLayout;

    if (!matrixShapeIndices || matrixShapeIndices.length === 0) {
      return null;
    }

    const labels = matrixShapeIndices.map((d, i) => {
      return (
        <text
          key={i}
          x={dx * d.col + dx}
          y={dy * d.row + dy}
          fill="#1890FF"
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={16}
          fontWeight={600}
        >
          {d.val}
        </text>
      );
    });

    return <g>{labels}</g>;
  }

  _renderSVGLayers() {
    const {currentStep} = this.props;

    if (currentStep === 2) {
      return <g>{this._renderQuantizedLabels()}</g>;
    }
    if (currentStep === 3) {
      return (
        <g>
          {this._renderQuantizedLabels()}, {this._renderShapeIndexLabels()}
        </g>
      );
    }
    return <g />;
  }

  _renderDeckGLLayers() {
    const {currentStep} = this.props;
    if (currentStep === 0) {
      return [this._renderScatterplot()];
    }
    return [this._renderMatrix()];
  }

  render() {
    const {container, innerContainer, navPanel, contentPanel, nextButton, prevButton} = this.style;
    const {currentStep, siderWidth, matrixLayout} = this.props;
    const {width, height} = matrixLayout;

    if (width <= 0 || height <= 0) {
      return null;
    }

    return (
      <Layout>
        <Content style={container}>
          <Layout>
            <Sider width={siderWidth} style={navPanel}>
              <Steps direction="vertical" size="small" current={currentStep}>
                {STEPS.map(({description}, i) => <Steps.Step key={i} description={description} />)}
              </Steps>
              <Button
                style={prevButton}
                type={currentStep > 0 ? 'primary' : 'default'}
                disabled={currentStep === 0}
                onClick={() => this.props.updateCurrentStep(Math.max(0, currentStep - 1))}
              >
                Prev
              </Button>
              <Button
                style={nextButton}
                type={currentStep < 4 ? 'primary' : 'default'}
                disabled={currentStep === 4}
                onClick={() => this.props.updateCurrentStep(Math.min(4, currentStep + 1))}
              >
                Next
              </Button>
            </Sider>

            <Content style={contentPanel}>
              <DeckGL
                width={width}
                height={height}
                style={innerContainer}
                layers={this._renderDeckGLLayers()}
                viewport={new OrthographicViewport({width, height, left: 0, top: 0})}
              />
              <svg width={width} height={height} style={innerContainer}>
                {this._renderSVGLayers()}
              </svg>
            </Content>
          </Layout>
        </Content>
      </Layout>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
