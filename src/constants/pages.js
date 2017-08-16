function getDocUrl(filename) {
  return `docs/${filename}`;
}

// mapping from file path in source to generated page url
export const markdownFiles = {};

function generatePath(tree, parentPath = '') {
  if (Array.isArray(tree)) {
    tree.forEach(branch => generatePath(branch, parentPath));
  }
  if (tree.name && !tree.path) {
    tree.path = tree.name
      .match(/(GeoJson|3D|API|([A-Z]|^)[a-z'0-9]+|\d+)/g)
      .join('-')
      .toLowerCase()
      .replace(/[^\w-]/g, '');
  }
  if (tree.children) {
    generatePath(tree.children, `${parentPath}/${tree.path}`);
  }
  if (typeof tree.content === 'string') {
    markdownFiles[tree.content] = `${parentPath}/${tree.path}`;
  }

  return tree;
}

export const docPages = generatePath([
  {
    name: 'Welcome!',
    content: getDocUrl('demos/introduction.md')
  },
  {
    name: 'Live Code Playground',
    env: 'development',
    content: getDocUrl('demos/live-code.md')
  },
  {
    name: 'React Map GL',
    children: [
      {
        name: 'Starting With a Map',
        content: getDocUrl('demos/starting-with-map.md')
      }
    ]
  },
  {
    name: 'Mapping guidelines',
    children: [
      {
        name: 'Mapping types',
        path: 'simple',
        content: getDocUrl('guidelines/mapping.md')
      },
      {
        name: 'Scatterplot',
        path: 'scatterplot',
        content: getDocUrl('guidelines/scatterplot.md')
      },
      {
        name: 'Arc',
        path: 'arc',
        content: getDocUrl('guidelines/arc.md')
      },
      {
        name: 'Hexagon',
        path: 'hexagon',
        content: getDocUrl('guidelines/hexagon.md')
      }
    ]
  },
  {
    name: 'Deck GL',
    children: [
      {
        name: 'Scatterplot Overlay',
        content: getDocUrl('demos/scatterplot-overlay.md')
      },
      {
        name: 'Hexagon Overlay',
        content: getDocUrl('demos/hexagon-overlay.md')
      }
    ]
  },
  {
    name: 'Visualization guidelines',
    children: [
      {
        name: `Do - clear simple charts`,
        path: 'simple',
        content: getDocUrl('guidelines/simple.md')
      },
      {
        name: `Don't - too much to see`,
        path: 'toomuch',
        content: getDocUrl('guidelines/toomuch.md')
      },
      {
        name: `Do - use hierarchy`,
        path: 'hiearchy',
        content: getDocUrl('guidelines/hierarchy.md')
      },
      {
        name: `Don't - confusing axes`,
        path: 'axes',
        content: getDocUrl('guidelines/axes.md')
      }
    ]
  },
  {
    name: 'React Vis',
    children: [
      {
        name: 'Add Charts',
        content: getDocUrl('demos/add-charts.md')
      },
      {
        name: 'Line Charts',
        content: getDocUrl('demos/line-charts.md')
      },
      {
        name: 'Scatterplot Charts',
        content: getDocUrl('demos/scatterplot-charts.md')
      }
    ]
  }
]);
