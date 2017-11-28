<ul class='insert learning-objectives'>
<li>Discuss what is testing</li>
<li>Write our first set of tests</li>
</ul>

## What is testing?

Before we even get started let's take a minute to discuss what's even the point of writing tests and what can we possibly accomplish.

Testing is writing specific code ("tests") to verify if our app works as intended. 
We can the run these tests independently of the app. Each test can pass or fail. If all tests pass, then the app works indeed as expected; however, if even one single test fails, that means that an issue must be investigated.

Web apps are typically made of many different parts, components, but also containers, actions, reducers etc. When changing one part of the app, it's difficult to foresee if that change won't cause any issue with other components (and the more complex the app, the harder it is).

But with testing, it is possible to _prevent_ some of these problems. If after a change, a test that previously passed now fails, this means that there is a larger issue at play - at a minimum, the test must be changed.

It's also often a good idea to write tests after a change, because such a test can _explain_ the idea behind the change. The second function of tests, beyond preventing bugs, is to describe expected behaviors of the app; tests are also a form of documentation.

## Smoke tests

Smoke tests are the dumbest, most basic tests. We're just trying to see if calling the React components of our app doesn't cause a crash. Even though they are very short and easy to write, and that they can prevent catastrophic (albeit unlikely) failures, in the grand scheme of things, they are rarely worth the time. 

What they are good for, however, is to help us understand how to get started with testing.

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

Now, create a "test" folder in our "src" folder, and create two files inside, index.js and smoke-tests.js.

index.js is where we'll organize all our tests. For now, just add this single line:

```
import './smoke-tests';
```

And now, add this to smoke-tests.js: 

```
import React from "react";
import test from "tape-catch";

import App from "../app";
import Charts from "../charts";
import DeckGLOverlay from "../deckgl-overlay";
import { LayerControls } from "../layer-controls";

test("Smoketests", assert => {
  const app = <App />;
  assert.ok(true, 'App smoke test ok');
  const charts = <Charts />;
  assert.ok(true, "Charts smoke test ok");
  const deckGLOverlay = <DeckGLOverlay />;
  assert.ok(true, "DeckGLOverlay smoke test ok");
  const layerControls = <Controls />;
  assert.ok(true, "layerControls smoke test ok");

  assert.end();
});
```

Once this is done, you may type in your CLI:

```
npm run test
```

And you should get:

```
# Smoke tests
ok 1 App smoke test ok
ok 2 Charts smoke test ok
ok 3 DeckGLOverlay smoke test ok
not ok 4 ReferenceError: Controls is not defined

(lengthy error message)

1..4
# tests 4
# pass  3
# fail  1

error Command failed with exit code 1.

```

## Analysis of smoke-test.js

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
# Smoketests
ok 1 App smoke test ok
ok 2 Charts smoke test ok
ok 3 DeckGLOverlay smoke test ok
ok 4 layerControls smoke test ok

1..4
# tests 4
# pass  4

# ok
```

Awesome! all tests pass!

Finally, assert.end() signals there will be no more tests and is __required__.

Congratulations, you've written your first series of tests! 

Let's continue to the next section: [code coverage](#testing-a-geospatial-app/2-code-coverage).

<ul class='insert takeaways'>
<li>Testing helps prevent bugs especially as parts of the app are updated independantly.</li>
<li>Testing means running a series of tests which must all pass.</li>
<li>Smoke tests test if a component constructor will run without crashing.</li>
<li>Smoke tests are very simple tests but can prevent catastrophic failures.</li>
</ul>