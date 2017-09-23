<ul class='insert learning-objectives'>
  <li>Create a GraphRender component</li>
  <li>Render a graph with random layout</li>
</ul>

## 1. Create a Graph Render Component


Create a new file named `graph-render.js` where we will put the deck.gl
component. First, let's layout the component:

```js
import React, {Component} from 'react';
import DeckGL from 'deck.gl';

export default class GraphRender extends Component {
  render() {
    const layers = [];
    return (
      <DeckGL layers={layers} />
    );
  }
}
```

This gives us the basic structure, using the export `DeckGL` react component
to render our `deck.gl` overlay. You'll notice that `layers` is being passed to
`DeckGL` but it's an empty array. We have to initialize each `deck.gl` layer
separately. Let's edit the function and creat a `ScatterplotLayer` in `render()` function.


## 4. Node Layer: Add Scatterplot Layer with Deck.gl

Let's see if we can add a `Scatterplot` overlay with the graph node data we loaded in the previous example.

[Deck.GL](http://uber.github.io/deck.gl) is a WebGL overlay suite for React,
providing a set of highly performant data visualization overlays.

`Deck.GL` comes with several prepackaged layers that we can use to show all kinds graph visualization.
The simplest one is the `ScatterplotLayer` which we will use.

```js

```

## 5. Edge Layer: Add Line Layer with Deck.gl

```js

```

## 3. Viewport

```js

```

## 6. Complete Code

```js

```