// Setup

import SetupWindows from "docs/installing-a-coding-environment/1-install-tools-windows.md";
import SetupMac from "docs/installing-a-coding-environment/2-install-tools-mac.md";
import SetupCloning from "docs/installing-a-coding-environment/3-cloning.md";

// Building a geospatial app
import GeospatialAppSetup from "docs/building-a-geospatial-app/0-setup.md";
import GeospatialAppStartingMap from "docs/building-a-geospatial-app/1-starting-with-map.md";

import GeospatialAppMappingSimple from "docs/building-a-geospatial-app/mapping/simple.md";
import GeospatialAppMappingScatterplot from "docs//building-a-geospatial-app/mapping/scatterplot.md";
import GeospatialAppMappingArc from "docs/building-a-geospatial-app/mapping/arc.md";
import GeospatialAppMappingHexagon from "docs/building-a-geospatial-app/mapping/hexagon.md";

import GeospatialAppDeckScatterplot from "docs/building-a-geospatial-app/2-scatterplot-overlay.md";
import GeospatialAppDeckHexagon from "docs/building-a-geospatial-app/3-hexagon-overlay.md";

import GeospatialAppBasicCharts from "docs/building-a-geospatial-app/4-basic-charts.md";
import GeospatialAppInteractions from "docs/building-a-geospatial-app/5-interactions.md";
import GeospatialAppLinkingAll from "docs/building-a-geospatial-app/6-linking-it-all.md";

import GeospatialAppSimpleCharts from "docs/building-a-geospatial-app/guidelines/simple.md";
import GeospatialAppHierarchy from "docs/building-a-geospatial-app/guidelines/hierarchy.md";
import GeospatialAppTooMuch from "docs/building-a-geospatial-app/guidelines/toomuch.md";
import GeospatialAppConfusing from "docs/building-a-geospatial-app/guidelines/axes.md";

// testing a geospatial app
import testingIntro from "docs/testing-a-geospatial-app/0-intro.md";
import testingSmokeTests from "docs/testing-a-geospatial-app/1-smoke-tests.md";
import testingCodeCoverage from "docs/testing-a-geospatial-app/2-code-coverage.md";
import testingTestingUI from "docs/testing-a-geospatial-app/3-testing-ui.md";
import testingTestingActions from "docs/testing-a-geospatial-app/4-testing-actions.md";

// graph vis
import setupGraph from "docs/graph/0-setup.md";
import graphRender from "docs/graph/1-render.md";
import startGraph from "docs/graph/2-basic-graph.md";
import layoutEngine from "docs/graph/3-layout-engine.md";
import interactionHover from "docs/graph/4-interaction.md";

// custom layers
import setupCustomLayer from "docs/custom-layers/0-setup.md";
import combinationLayer from "docs/custom-layers/1-combination-layer.md";
import adaptorLayer from "docs/custom-layers/2-adaptor-layer.md";
import customShader from "docs/custom-layers/3-custom-shader.md";
import customAttribute from "docs/custom-layers/4-custom-attribute.md";
import customUniform from "docs/custom-layers/5-custom-uniform.md";

// kepler.gl
import KeplerglSetup from "docs/kepler.gl/0-setup.md";
import KeplerglImport from "docs/kepler.gl/1-import-keplergl.md";
import KeplerglLoadData from "docs/kepler.gl/2-load-data-and-export-configuration.md";
import KeplerglLoadConfig from "docs/kepler.gl/3-load-config.md";

export default [
  {
    name: "Installing a coding environment",
    desc: "Prepare your machine for the Academy",
    image: "images/setup/setup.png",
    path: "/installing-a-coding-environment",
    data: [
      {
        name: "Installing tools - Windows",
        markdown: SetupWindows
      },
      {
        name: "Installing tools - Mac",
        markdown: SetupMac
      },
      {
        name: "Downloading code examples",
        markdown: SetupCloning
      }
    ]
  },
  {
    name: "Building a Geospatial App",
    desc:
      "Learn how to create maps, layer data on top of them and draw charts with the Uber vis libraries.",
    image: "images/geospatial-app/geospatial-app.png",
    badges: ["react-vis", "react-map-gl", "deck.gl"],
    path: "/building-a-geospatial-app",
    data: [
      {
        name: "Setup",
        markdown: GeospatialAppSetup
      },
      {
        name: "1. Starting with a Map",
        markdown: GeospatialAppStartingMap
      },
      {
        name: "2. Map data overlays - scatterplot",
        markdown: GeospatialAppDeckScatterplot
      },
      {
        name: "3. More data overlays - hexagons",
        markdown: GeospatialAppDeckHexagon
      },
      {
        name: "4. A basic chart",
        markdown: GeospatialAppBasicCharts
      },
      {
        name: "5. Interacting with charts",
        markdown: GeospatialAppInteractions
      },
      {
        name: "6. Linking it all",
        markdown: GeospatialAppLinkingAll
      },
      {
        name: "Data overlays gallery",
        children: [
          {
            name: "Mapping types",
            markdown: GeospatialAppMappingSimple
          },
          {
            name: "Scatterplot",
            markdown: GeospatialAppMappingScatterplot
          },
          {
            name: "Arc",
            markdown: GeospatialAppMappingArc
          },
          {
            name: "Hexagon",
            markdown: GeospatialAppMappingHexagon
          }
        ]
      },
      {
        name: "Visualization Guidelines",
        children: [
          {
            name: "Do: Clear simple charts",
            markdown: GeospatialAppSimpleCharts
          },
          {
            name: "Do: Use hierarchy",
            markdown: GeospatialAppHierarchy
          },
          {
            name: "Don't: Too much to see",
            markdown: GeospatialAppTooMuch
          },
          {
            name: "Don't: Confusing axes",
            markdown: GeospatialAppConfusing
          }
        ]
      }
    ]
  },
  {
    name: "Testing a Geospatial App",
    desc:
      "Learn how to write tests for a react-redux web app, using our geospatial app as an example.",
    image: "images/setup/testing.png",
    badges: ["react", "redux", "enzyme"],
    path: "/testing-a-geospatial-app",
    data: [
      {
        name: "0. Introduction",
        markdown: testingIntro
      },
      {
        name: "1. Smoke Tests",
        markdown: testingSmokeTests
      },
      {
        name: "2. Code Coverage",
        markdown: testingCodeCoverage
      },
      {
        name: "3. Testing UIs",
        markdown: testingTestingUI
      },
      {
        name: "4. Testing Actions",
        markdown: testingTestingActions
      }
    ]
  },
  {
    name: "Building a Graph Vis",
    desc:
      "Learn how to create a graph visualization in webGL, with d3-force layout.",
    image: "images/graph-vis/cover.png",
    badges: ["deck.gl"],
    path: "/graph-vis",
    data: [
      {
        name: "Setup",
        markdown: setupGraph
      },
      {
        name: "1. Graph Render",
        markdown: graphRender
      },
      {
        name: "2. Basic Graph Application",
        markdown: startGraph
      },
      {
        name: "3. Plugin Layout Engine",
        markdown: layoutEngine
      },
      {
        name: "4. Interacting With Graph",
        markdown: interactionHover
      }
    ]
  },
  {
    name: "Custom Layers",
    desc: "Advanced topic: learn how to create your own deck.gl layers.",
    image: "images/custom-layers/cover.png",
    badges: ["deck.gl"],
    path: "/custom-layers",
    data: [
      {
        name: "Setup",
        markdown: setupCustomLayer
      },
      {
        name: "1. Combination Layer",
        markdown: combinationLayer
      },
      {
        name: "2. Adaptor Layer",
        markdown: adaptorLayer
      },
      {
        name: "3. Custom Shader",
        markdown: customShader
      },
      {
        name: "4. Custom Attribute",
        markdown: customAttribute
      },
      {
        name: "5. Custom Uniform",
        markdown: customUniform
      }
    ]
  },
  {
    name: "Embedding Kepler.gl",
    desc: "Advanced topic: learn how to use kepler.gl in your web application.",
    image: "images/kepler-card.png",
    badges: ["react", "webGL", "kepler.gl"],
    path: "/kepler.gl",
    data: [
      {
        name: "Setup",
        markdown: KeplerglSetup
      },
      {
        name: "1. Import",
        markdown: KeplerglImport
      },
      {
        name: "2. Load Data",
        markdown: KeplerglLoadData
      },
      {
        name: "3. Load Config",
        markdown: KeplerglLoadConfig
      }
    ]
  }
];
