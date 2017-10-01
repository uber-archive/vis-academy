import DeckGL, {ScatterplotLayer} from 'deck.gl';

const fragmentShader = `\
#define SHADER_NAME scatterplot-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

void main(void) {

  float distToCenter = length(unitPosition);

  if (distToCenter <= 1.0 && distToCenter >= innerUnitRadius) {
    gl_FragColor = vColor;
  } else {
    discard;
  }
}
`;

const crossMarkFragmentShader = `\
#define SHADER_NAME scatterplot-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

void main(void) {

  if (abs(unitPosition.x) < 0.2 || abs(unitPosition.y) < 0.2) {
    gl_FragColor = vColor;
  } else {
    discard;
  }
}
`;

const arrowHeadFragmentShader = `\
#define SHADER_NAME scatterplot-layer-fragment-shader

#ifdef GL_ES
precision highp float;
#endif

varying vec4 vColor;
varying vec2 unitPosition;
varying float innerUnitRadius;

void main(void) {

  if (unitPosition.x < 1.0 - abs(unitPosition.y) * 4.0) {
    gl_FragColor = vColor;
  } else {
    discard;
  }
}
`;

export default class MyScatterplotLayer extends ScatterplotLayer {

  getShaders() {
    return {
      ...super.getShaders(),
      fs: crossMarkFragmentShader
    };
  }

}
