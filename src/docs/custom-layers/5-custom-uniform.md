<!-- INJECT:"CustomUniform" heading -->

<ul class='insert learning-objectives'>
<li>Extend a core layer and add custom uniforms.</li>
</ul>

# Custom Uniform

In this exercise, we make a simple animation that shows the taxi pickup pattern at different time of the day. As the animation loops through the 24 hours of a day, we show the pickups that happen in that hour.

If you are familiar with d3.js, it makes animation by changing the attributes of SVG elements. In WebGL, the performance bottleneck is not the number of instances, but the data exchange between CPU and GPU. If we use instance attributes to modify visibility, a new array must be uploaded to the GPU every time it updates. Instead, we will add an attribute that represents each pickup's timestamp, and make the GPU calculate the appropriate visibility for each instance based on a uniform that represents the "current time of day" in the animation.

## 1. Add an attribute for pickup time

Just like the last example, in `my-scatterplot-layer.js`, we declare another attribute `instanceTimes` that is populated by a new prop `getTime`:
```js
export default class MyScatterplotLayer extends ScatterplotLayer {
  initializeState() {
    super.initializeState(...arguments);

    this.state.attributeManager.addInstanced({
      instanceAngles: {size: 1, accessor: 'getAngle'},
      instanceTimes: {size: 1, accessor: 'getTime'}
    });
  }
}
```

And in `deckgl-overlay.js`, we will provide the `getAngle` accessor:
```js
      new MyScatterplotLayer({
        ...
        getTime: d => {
          const pickupDate = new Date(d.pickup_datetime);
          return pickupDate.getUTCHours() + pickupDate.getMinutes() / 60;
        }
      })
```
This will return a number in the [0, 24] range that represents the time of day when each pickup happened.

## 2. Add a uniform

We also need to know the "current time" in the animation for the GPU to calculate visibility. In `my-scatterplot-layer.js`, we will override the `updateState` lifecycle mothod and send a new uniform `currentTime` to the layer's model:

```js
export default class MyScatterplotLayer extends ScatterplotLayer {
  updateState({props}) {
    super.updateState(...arguments);

    this.state.model.setUniforms({
      currentTime: props.currentTime
    });
  }
}
```

The value of this uniform comes from a new layer prop `currentTime`. We will add this prop when we use this layer in `deckgl-overlay.js`:
```js
      new MyScatterplotLayer({
        ...
        timeOfDay: (Date.now() / 1000) % 24
      })
```
This number will loop through [0, 24] every 24 seconds using the computer's clock.

### 3. Vertex shader: calculate instance opacity

In this layer's vertex shader, we must declare the new attribute and the new uniform that were added:
```js
attribute float instanceTimes;
uniform float currentTime;
```

We will also declare a `varying` variable, which is how vertex shader can send data to the fragment shader. In this case, we will pass an opacity value based on the time of each pickup instance:
```js
varying float vAlpha;
```

In the `main` function, we will calculate this opacity as such:
```js
void main(void) {
  ...
  vAlpha = 1.0 - abs(instanceTimes - currentTime);
}
```
This says that the opacity peaks at 1.0 (100%) when pick up time is the current time, and gradually fades out. Each instance is only visible if it was picked up within 1 hour of the current time.

### 4. Fragment shader: render with opacity

We will declare the same `varying` variable in the fragment shader:
```js
varying float vAlpha;
```

And in the fragment shader's `main` function, replace the line
```js
    gl_FragColor = vColor;
```
with
```js
    gl_FragColor = vec4(vColor.rgb, vAlpha);
```

Run the app, see the scatterplot fading in and out throughout the day.

# Congratulations!

You've learned to create custom layers for deck.gl with advanced techniques such as creating a composite layer and extending an existing layer.

Still have questions? Read the [documentation](https://uber.github.io/deck.gl/#/documentation/custom-layers/writing-your-own-layer). It always contains the latest and most in-detail explaination of how things work.

Enjoy making visualizations with deck.gl!
