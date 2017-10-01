<!-- INJECT:"CustomAttribute" heading -->

<ul class='insert learning-objectives'>
<li>Extend a core layer and add custom attributes.</li>
</ul>

# Custom Attribute

Attributes are how the CPU sends per-instance information to the GPU. By adding an attribute to the scatterplot layer, we can make each data point look different.

In this exercise, we will make each icon at pickup spot an arrow pointing to the direction that the rider is going.

## 1. Declare an attribute

In `my-scatterplot-layer.js`, add a `initializeState` method to our layer class:

```js
export default class MyScatterplotLayer extends ScatterplotLayer {
  initializeState() {
    super.initializeState();

    this.state.attributeManager.addInstanced({
      instanceAngles: {size: 1, accessor: 'getAngle'}
    });
  }
}
```
This code adds a new instanced attribute `instanceAngles`, that is automatically filled with the accessor `Layer.prop.getAngle`. The `attributeManager` is automatically created for every layer. Check the [API reference](https://uber.github.io/deck.gl/#/documentation/api-reference/attribute-manager) to learn more about the attribute manager.

In `deckgl-overlay.js`, we will provide the `getAngle` accessor:
```js
    const layers = [
      new MyScatterplotLayer({
        ...
        getAngle: d => Math.atan2(d.dropoff_latitude - d.pickup_latitude, d.dropoff_longitude - d.pickup_longitude)
      })
    ];
```

## 2. Replace the vertex shader

Attributes are accessible from the vertex shader, which is run to calculate the positions of vertices. To modify the vertex shader, let's head back to the `getShaders` method and print the default vertex shader code:

```js
  getShaders() {
    console.log(super.getShaders().vs);
    ...
  }
```

Copy it to the top of this file, as such:

```js
const vertexShader = `
#define SHADER_NAME scatterplot-layer-vertex-shader
...
`;
```

The shader is quite long, but don't be intimidated. We will walk through the code together.

Now replace the default shader with ours:
```js
  getShaders() {
    return {
      ...super.getShaders(),
      vs: vertexShader,
      fs: fragmentShader
    };
  }
```

## 3. Understand the vertex shader

The vertex shader has two parts: the declaration of variables, and the main function. Variables are data that are passed into the vertex shader from outside:

```js
// Attributes
attribute vec3 instancePositions;
attribute float instanceRadius;
...
// Uniforms
uniform float opacity;
uniform float radiusScale;
...
// Varyings
varying vec4 vColor;
varying vec2 unitPosition;
...
```

You must declare an attribute before using it. Let's add our new attribute to this block:
```
attribute float instanceAngles;
```

The main function calculates the position of the current vertex:
```js
void main(void) {
  ...
  vec3 center = project_position(instancePositions);
  vec3 vertex = positions * outerRadiusPixels;
  gl_Position = project_to_clipspace(vec4(center + vertex, 1.0));
  ...
}
```

The scatterplot layer draws a rectangle at each data point. Every time the vertex shader is run, it calculates one of the corners of the rectangle. `center` is the location of the data point; and `vertex` is the current corner's offset from the center.

To use the user specified angle, we will add a `rotate` function to the shader. Check [Wikipedia](https://en.wikipedia.org/wiki/Rotation_matrix) for the math behind a rotation matrix:

```js
vec3 rotateZ(vec3 vector, float angle) {
  mat2 rotationMatrix = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
  return vec3(rotationMatrix * vector.xy, vector.z);
}
void main(void) {
  ...
}
```

Then before we use the vertex offset, we rotate it by the angle:
```js
void main(void) {
  ...
  vec3 center = project_position(instancePositions);
  vec3 vertex = positions * outerRadiusPixels;

  // Rotate by instanceAngles
  vertex = rotateZ(vertex, instanceAngles);

  gl_Position = project_to_clipspace(vec4(center + vertex, 1.0));
  ...
}
```


You can now head to the next step:
[Custom Uniform](#/custom-layers/5-custom-uniform)
