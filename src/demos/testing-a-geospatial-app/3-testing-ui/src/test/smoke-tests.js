import React from "react";

import App from "../app";
import Charts from "../charts";
import DeckGLOverlay from "../deckgl-overlay";
import { LayerControls } from "../layer-controls";

import test from "tape-catch";

test("Smoketests", assert => {
  const app = <App />;
  assert.ok(true, 'App smoke test ok');
  const charts = <Charts />;
  assert.ok(true, "Charts smoke test ok");
  const deckGLOverlay = <DeckGLOverlay />;
  assert.ok(true, "DeckGLOverlay smoke test ok");
  const layerControls = <LayerControls />;
  assert.ok(true, "layerControls smoke test ok");

  assert.end();
});
