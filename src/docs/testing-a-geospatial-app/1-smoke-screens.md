## What is testing?

Before we even get started let's take a minute to discuss what's even the point of writing tests and what can we possibly accomplish.

Testing is writing specific code ("tests") to verify if our app works as intended. 
We can the run these tests independently of the app. Each test can pass or fail. If all tests pass, then the app works indeed as intended; however, if even one single test fails, that means that an issue must be investigated.

Web apps are typically made of many different parts, components, but also containers, actions, reducers etc. When changing one part of the app, it's difficult to foresee if that change won't cause any issue with other components (and the more complex the app, the harder it is). But with testing, it is possible to prevent some of these problems. If after a change, a test that previously passed now fails, this means that there is a larger issue at play - at a minimum, the test must be changed. 
It's also often a good idea to write tests after a change, because such a test can explain the idea behind the change. The second function of tests, beyond preventing bugs, is to describe expected behaviors of the app; tests are also a form of documentation.

## Smoke screens

Smoke screens are the dumbest, most basic tests. We're just trying to see if calling the React components of our app doesn't cause a crash. They are honestly not super useful in the grand scheme of things, but they are also super easy and short to write and if a smoke screen ever fails, you certainly have a problem. So let's write our first set of smoke screens.

## Installing new stuff

We're going to need a few new modules. So go ahead and type in your CLI:

```
npm install tape tape-catch babel-preset-env --save-dev
```

(or yarn add instead of npm install)

We are going to add a few other modifications to our package.json file. 

Under "scripts", in addition to the "start-local", "start" and "build" entries, add this entry:
```
"test": "NODE_ENV=test tape -r babel-register -r ./src/test/" 
```
(don't forget to add a comma on the property before that!)
Likewise, in addition to "scripts", "dependencies" and "devDependencies", create a new entry "babel" like so:

```
  "babel": {
    "presets": [
      "env",
      "stage-2",
      "react"
    ]
  }
```
(and again, add commas as needed.)

## Writing our first tests

Now, create a "test" folder in our "src" folder, and create two files inside, index.js and smoke-screens.js.

index.js is where we'll organize all our tests. For now, just add this single line:

```
import './smoke-screens';
```

And now, add this to smoke-screens.js: 

```
import React from "react";
import test from "tape-catch";

import App from "../app";
import Charts from "../charts";
import DeckGLOverlay from "../deckgl-overlay";
import { LayerControls } from "../layer-controls";

test("Smokescreens", assert => {
  const app = <App />;
  assert.ok(true, 'App smoke screen ok');
  const charts = <Charts />;
  assert.ok(true, "Charts smoke screen ok");
  const deckGLOverlay = <DeckGLOverlay />;
  assert.ok(true, "DeckGLOverlay smoke screen ok");
  const layerControls = <Controls />;
  assert.ok(true, "layerControls smoke screen ok");

  assert.end();
});
```

Once this is done, you may type in your CLI:

```
npm run test
```

And you should get:

```
# Smokescreens
ok 1 App smoke screen ok
ok 2 Charts smoke screen ok
ok 3 DeckGLOverlay smoke screen ok
not ok 4 ReferenceError: Controls is not defined

(lengthy error message)

1..4
# tests 4
# pass  3
# fail  1

error Command failed with exit code 1.

```

## Analysis of smoke-screen.js

We're importing React, because we're going to write some JSX. Then test from tape-catch, which is what we are going to use to write our tests.
We import all of our components.

Then we'll use test(message, function). Here, I chose to name the argument to my function "assert" by convention. 
Once inside test, we can use certain methods on that assert argument. Here, we only use 2: ok and end.

assert.ok(value, message) just checks whether the value is truthy, if so, it prints a message.
However, this simple test will fail if there has been an error since the last test.

In our case, our 4th case failed, which means that there has been an error between the 3rd and the 4th. There's only one statement in between:

```
const layerControls = <Controls />;
```

And our test fails because Controls is not defined. The right component name is LayerControls. So go ahead and replace Controls by LayerControls:

```
const layerControls = <LayerControls />;
```

and now run npm run test again:

```
# Smokescreens
ok 1 App smoke screen ok
ok 2 Charts smoke screen ok
ok 3 DeckGLOverlay smoke screen ok
ok 4 layerControls smoke screen ok

1..4
# tests 4
# pass  4

# ok
```

Awesome! all tests pass!

Finally, assert.end() signals there will be no more tests and is __required__.

Congratulations, you've written your first series of tests! 

Let's continue to the next section: [code coverage](#testing-a-geospatial-app/2-code-coverage).
