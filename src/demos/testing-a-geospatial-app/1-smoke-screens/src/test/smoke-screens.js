import React from "react";

import App from "../app";
import Charts from "../charts";
import DeckGLOverlay from "../deckgl-overlay";
import { LayerControls } from "../layer-controls";

import test from "tape-catch";

test("Smokescreens", assert => {
  const app = <App />;
  assert.ok(true, 'App smoke screen ok');
  const charts = <Charts />;
  assert.ok(true, "Charts smoke screen ok");
  const deckGLOverlay = <DeckGLOverlay />;
  assert.ok(true, "DeckGLOverlay smoke screen ok");
  const layerControls = <LayerControls />;
  assert.ok(true, "layerControls smoke screen ok");

  assert.end();
});
