<ul class='insert learning-objectives'>
<li>See how components can be tested in a simulated browser environment</li>
<li>Learn how to test attributes of elements created by components</li>
<li>Simulate events such as clicks on our test components</li>
<li>Setup spy functions</li>
</ul>

## Testing UI

In this section, we're going to go deeper than simply trying to call component constructors.
We're going to use Enzyme to test how actual components behave once rendered. That should be difficult, because when testing, we are not in a browswer environment and we don't have a DOM in which to actually render the component. This is why Enzyme comes with a companion module, JSDOM, which can simulate the DOM while testing.

To make this work, we're going to have to add quite a few things:

```
npm install babel-polyfill enzyme enzyme-adapter-react-15 jsdom jsdom-global sinon --save-dev
```

What do they all do?
* babel-polyfill is so that some ES6 JS features will be available during testing. That's typically not a problem when using the application that we want to test in a browser, because we use build systems and transpilers. But the testing environment doesn't have that.
* enzyme is the main module which will let us test our components in the DOM.
* enzyme-adapter-react-15: enzyme needs to be configured to work in a certain environment, through "adapters". 
* jsdom is the javascript "headless browser" that will be used to simulate the DOM.
* jsdom-global will inject the parts of the DOM API you need for testing in your node.js environment.
* sinon is a module we will use to build spy functions.

We're not done yet!

Create a new file in src/test called 'setup-browser-env' and paste this:

```
/* setup.js */
import 'babel-polyfill';
import JSDOM from 'jsdom';
const Adapter = require('enzyme-adapter-react-15');
const { configure } = require('enzyme');

require('jsdom-global')();

configure({ adapter: new Adapter() });
```

Go back to your package.json file and modify the "test" script like so:

```
"test": "NODE_ENV=test tape -r babel-register -r ./src/test/setup-browser-env.js ./src/test/",
```

create another file in /src/test called components.js. It can be left empty for now.

Finally, we're going to add it to our /src/test/index.js:

```
import "./components";
import "./smoke-screens";
```

Are you ready? Let's test!

## Shallow mounting

Let's open our src/test/component.js file.

```
import React from "react";
import { shallow } from "enzyme";
import test from "tape-catch";
import App from "../app";

test("Mounting the app", assert => {
  const app = shallow(<App />);
  assert.ok(app.exists(), "App mounted");
  assert.end();
});
```

And try npm run test.
That test doesn't pass! why? Because App requires an init prop and a changeViewport prop. We're try to shallow-mount our component in the DOM. That means that the constructor and componentDidMount methods are going to be called. That's different from our smoke screens! 
In Enzyme parlance, app (that is, the output of shallow(<App />)) is a wrapper. A wrapper contains a tree of nodes. 

So let's modify our test:

```
test("Mounting the app", assert => {
  const app = shallow(<App init={() => {}} changeViewport={() => {}} />);
  assert.ok(app.exists(), "App mounted");
  assert.end();
});
```

Now this passes. 
Let's take a closer look at what we're testing. exists() is a method from Enzyme which tests if a node exists. If applied to a wrapper, it tests whether it contains one node.

Let's make our tests a little bit more interesting with spy functions. 
We're going to import sinon, and add the following to our test:

```
import React from "react";
import { shallow } from "enzyme";
import test from "tape-catch";
import App from "../app";
import sinon from "sinon";

test("Mounting the app", assert => {
  const init = sinon.spy();
  const changeViewport = sinon.spy();
  const app = shallow(<App init={init} changeViewport={changeViewport} />);
  assert.ok(app.exists(), "App mounted");
  assert.equals(init.called, true, "init called");
  assert.equals(changeViewport.calledOnce, true, "changeViewport called once");
  app.unmount();
  assert.ok(true, "App unmounted");
  assert.end();
});
```

A spy function is a function which collects information about how, whwn and how often it's called.
Let's try a few ways to use them:
Here, we verify that init has been called - once, ten times, one hundred times? this test doesn't tell. At least once.
Then, we verify that changeViewport has been called exactly once.

Finally, we're going to unmount our wrapper. Doing so calls its componentDidUnmount method. 

## Full mounting and using fixtures

Next, we're going to test the Charts component.

```
test("mounting the charts", assert => {

  const chartsWithoutData = shallow(<Charts />);
  assert.equals(
    chartsWithoutData.find("div").children().length,
    0,
    "without data no chart is rendered"
  );
  asset.end();
});
```

Unfortunatalely, tests need a pickups prop to render anything else than a div - without that, it just renders an empty div.
This is what this test checks: the wrapper contains a div, but it has 0 children. 

To do anything more interesting, we're going to need data. We don't actually have to use real data, but we might as well.

So let's create a fixtures.js file in /src/test, and paste this inside:

```
module.exports = {
  pickups: [
    { hour: 0, x: 0.5, y: 246 },
    { hour: 1, x: 1.5, y: 173 },
    { hour: 2, x: 2.5, y: 98 },
    { hour: 3, x: 3.5, y: 59 },
    { hour: 4, x: 4.5, y: 53 },
    { hour: 5, x: 5.5, y: 102 },
    { hour: 6, x: 6.5, y: 294 },
    { hour: 7, x: 7.5, y: 466 },
    { hour: 8, x: 8.5, y: 574 },
    { hour: 9, x: 9.5, y: 542 },
    { hour: 10, x: 10.5, y: 434 },
    { hour: 11, x: 11.5, y: 510 },
    { hour: 12, x: 12.5, y: 468 },
    { hour: 13, x: 13.5, y: 435 },
    { hour: 14, x: 14.5, y: 526 },
    { hour: 15, x: 15.5, y: 453 },
    { hour: 16, x: 16.5, y: 400 },
    { hour: 17, x: 17.5, y: 503 },
    { hour: 18, x: 18.5, y: 602 },
    { hour: 19, x: 19.5, y: 645 },
    { hour: 20, x: 20.5, y: 647 },
    { hour: 21, x: 21.5, y: 662 },
    { hour: 22, x: 22.5, y: 609 },
    { hour: 23, x: 23.5, y: 498 }
  ]
};
```

Let's make sure to import that in our 'components.js' file - 

```
import { pickups } from "./fixtures";
```

now, we're going to try to count the bars that are created by Charts. We pass an array that has 24 items, so we expect 24 bars. In the app, Charts uses react-vis to create a BarSeries component, which, in turns, generates a certain number of rect SVG elements. So let's try this: 

```
test("mounting the charts", assert => {

  const chartsWithoutData = shallow(<Charts />);
  assert.equals(
    chartsWithoutData.find("div").children().length,
    0,
    "without data no chart is rendered"
  );

  const charts = shallow(
    <Charts
      pickups={pickups}
      highlight={highlight}
      select={select}
      highlightedHour={1}
      selectedHour={2}
    />
  );
  const bars = charts.find("rect");
  assert.equals(bars.length, 24, "charts has 24 rect elements");

  asset.end();
})
```

But this test doesn't work. That's because when shallow mounting, we can only see what happens one element deep. That's already super useful and faster than fully rendering the elements. But for this, shallow isn't enough, so let's use Enzyme's fuller API: mount().

Let's make sure to import it:

```
import { mount, shallow } from "enzyme";
```

now let's try this:

```

test("mounting the charts", assert => {
  const highlight = sinon.spy();
  const select = sinon.spy();

  const chartsWithoutData = shallow(<Charts />);
  assert.equals(
    chartsWithoutData.find("div").children().length,
    0,
    "without data no chart is rendered"
  );

  const charts = mount(
    <Charts
      pickups={pickups}
      highlight={highlight}
      select={select}
      highlightedHour={1}
      selectedHour={2}
    />
  );
  const bars = charts.find("rect");
  assert.equals(bars.length, 24, "charts has 24 rect elements");
  assert.equals(
    bars.first().props().style.fill,
    "#125C77",
    "unselected bar has normal color"
  );

  assert.equals(
    bars.at(1).props().style.fill,
    "#17B8BE",
    "highlighted bar has special color"
  );
  assert.equals(
    bars.at(2).props().style.fill,
    "#19CDD7",
    "selected bar has special color"
  );
  bars.first().simulate("mouseover");
  bars.first().simulate("click");

  assert.equals(highlight.callCount, 1, "highlight has been called once");
  assert.equals(select.callCount, 1, "select has been called once");
  charts.unmount();
  assert.end();
});
```

Our previous test passes. We can effectively see the 24 elements.

For the next set of tests, we're going to explore another really useful method of Enzyme: props(). We are going to select nodes, then test their properties, in this case, their style. Charts is supposed to render the highlighted and the selected bar with certain colors, and normal bars with another one.

But how to select a specific node out of many? we can use the at(n) method to select the nth method. For the first node of a series, we can use first() instead.

Next, we are going to simulate events, in this case mousing over a node and clicking on it.

Finally, we're going to use spy functions again to see that those events had an effect. This time we're using the more generic syntax, callCount, which stores the number of times a function has been called.

Let's continue to the next section: [testing actions](#testing-a-geospatial-app/4-testing-actions).

<ul class='insert takeaways'>
<li>Once the proper testing environment is set up, we can go well beyond smoke screens.</li>
<li>We can test and simulate how our components look but also how they react to events.</li>
</ul>
