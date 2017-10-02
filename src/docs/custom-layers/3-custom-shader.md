<!-- INJECT:"CustomShader" heading -->

<ul class='insert learning-objectives'>
<li>Extend a core layer and inject custom shaders.</li>
</ul>

# Custom Shader

## 1. Extend the ScatterplotLayer

Sometimes you may wish the ScatterplotLayer draws something other than a circle. Shouldn't be too hard, right?

Let's create a new file under the `src` folder and name it `my-scatterplot-layer.js`.

```js
import DeckGL, {ScatterplotLayer} from 'deck.gl';

export default class MyScatterplotLayer extends ScatterplotLayer {
  // Our custom layer code
}
```

In `deckgl-overlay.js`, draw the pickup points with this new layer. It should work identical to the ScatterplotLayer:

```js
import MyScatterplotLayer from './my-scatterplot-layer';

const layers = [
  new MyScatterplotLayer({
    id: 'pickup',
    data: this.props.data,
    getPosition: d => [d.pickup_longitude, d.pickup_latitude],
    getColor: d => PICKUP_COLOR,
    radiusScale: 40
  })
];
```

## 2. Replace the fragment shader

Shaders are the programs that the GPU runs to draw each point. In order to draw some new shapes, we will replace the default shader used by the ScatterplotLayer.

```js
export default class MyScatterplotLayer extends ScatterplotLayer {
  getShaders() {
    return super.getShaders();
  }
}
```

`Layer.getShaders` is the API that exposes the shaders that the layer uses. We can find the default fragment shader by calling `super.getShaders().fs`:

```js
  getShaders() {
    console.log(super.getShaders().fs);
    return super.getShaders();
  }
```

Open your developer console in the browser. you should see the shader code printed out like this:

```js
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
```

Copy the above into our custom layer, define a string variable like this:
```js
const fragmentShader = `
replace me with shader code
`;
```

And use this string to replace the default fragment shader:

```js
  getShaders() {
    return {
      ...super.getShaders(),
      fs: fragmentShader
    };
  }
```
Now you can control how the GPU draws the points by modifying the fragment shader code.

##  3. Draw a check mark

The scatterplot layer draws a rectangle around each data point coordinate. The rectangle is sized to match user defined radius. The `unitPosition` is a vector that measures any pixel's relative distance to the center of the rectangle, between `[-1, -1]` and `[1, 1]`.

In the fragment shader code, the `main` function is what controls the colors that are drawn to the screen. Note that it ends with a `if` switch: some fragments (think of them as pixels) are assigned a color, some are "discarded" (not drawn). The default implementation only draws a fragment if it's inside the unit circle (distance to center is less than 1.0):

```js
    float distToCenter = length(unitPosition);
    if (distToCenter <= 1.0 && distToCenter >= innerUnitRadius) {
      gl_FragColor = vColor;
    } else {
      discard;
    }
```

Now try come up with some math equation to draw something different. For example a cross:

```js
    if (abs(unitPosition.x) < 0.2 || abs(unitPosition.y) < 0.2) {
      gl_FragColor = vColor;
    } else {
      discard;
    }
```

An arrow head:

```js
    if (unitPosition.x < 1.0 - abs(unitPosition.y) * 4.0) {
      gl_FragColor = vColor;
    } else {
      discard;
    }
```

You can now head to the next step:
[Custom Shader](#/custom-layers/4-custom-attribute)
