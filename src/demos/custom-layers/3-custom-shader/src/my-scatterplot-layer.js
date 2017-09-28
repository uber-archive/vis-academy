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

  if (abs(unitPosition.x) < 0.2 || abs(unitPosition.y) < 0.2) {
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
      fs: fragmentShader
    };
  }

}
