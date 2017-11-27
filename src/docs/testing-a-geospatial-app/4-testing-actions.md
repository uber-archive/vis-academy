<ul class='insert learning-objectives'>
<li>What tests can be done on the store?</li>
<li>What are good practices when testing actions?</li>
</ul>

## Testing actions and the store

In the previous section, we've looked at the kind of things we can test in the UI - we can test the props of components (or properties of DOM elements such as style), simulate events, check whether functions have been called by the UI.

However, most of the logic of a web app happens in relation to the store: actions are created, dispatched, handled, reduced and then the store becomes props to containers. So, there's much more to a web app than how components render.

In this section, we are only going to graze the surface by showing what can be done - again, our app is simple. But that should give you a good idea of how to proceed.

## Testing actions via exported handlers

One tempting way to test actions is to export handlers and test them. In the src/reducer.js file, all action handlers are already exported, so let's try that - with the simplest of our actions, highlight.

```
import test from "tape-catch";
import { highlightHandler } from "../reducer";

test("Testing handlers", assert => {
  assert.deepEquals(
    highlightHandler({}, { payload: 1 }),
    { highlightedHour: 1 },
    "highlightHandler updates state"
  );

  assert.end();
});
```

So - this works, but what have we accomplished? If for whatever reason, the type of the action changes, the reducer changes, or anything - there's little guarantee that this specific handler is going to be called for this specific action.

## Testing actions with the reducer and action creators

Here's an alternative syntax:
```
import test from "tape-catch";
import { highlightHandler, reducer } from "../reducer";
import { highlight } from "../actions";

test("Testing handlers", assert => {
  assert.deepEquals(
    highlightHandler({}, { payload: 1 }),
    { highlightedHour: 1 },
    "highlightHandler updates state"
  );

  assert.deepEquals(
    reducer({}, highlight(1)).highlightedHour,
    1,
    "action creator is a more reliable way to test this"
  );
  assert.end();
});
```

In the second test, we call the _actual_ reducer and we pass it an action created with the _actual_ action creator. This is much closer to how things happen in the app, and so much more reliable.

## Testing the result of a series of actions

In real-life scenario, you'd want to test what happens if one action is dispatched, then another, then another. Your app logic is supposed to handle those sequences of actions. 

One of the advantages of using our reducer is that it outputs the updated value of the store's state.
So we can put it in a variable and use it to simulate several consecutive actions in sequence.

Let's try to use select to pass the same value twice. If you pass the same value twice, the value for selectedHour in the state is supposed to go back to null.

Let's make sure to import select from our actions too:

```
import { highlight, select } from "../actions";
```

Then, let's try this:

```
  let state = reducer({}, select(1));
  assert.equals(
    state.selectedHour,
    1,
    "Passing a value to selectedHour updates the state"
  );
  state = reducer(state, select(1));

  assert.equals(
    state.selectedHour,
    null,
    "Selecting the same value twice resets selectedHour"
  );
```

This works: passing the same value twice to select effectively resets selectedHour.

These kind of scenarios are usually helpful to test because the logic of this sequence of action makes sense to a human reader, and so if someone else reads your tests along with the expected behavior, this makes your app easier to understand than from reading the code.

## Testing helpers

While it's a better idea to test a combination of reducer + action creator than an action handler, when your action handler is so complex that it has to use helpers, it may be worth it to test the helpers directly.

Here, we are going to test processData - let's make sure to import it first:

```
import { highlightHandler, processData, reducer } from "../reducer";
```

We are also going to be importing the input data from the app, and our fixture data:

```
import taxiData from "../../../../data/taxi";
import { pickups } from "./fixtures";
```

Then, we can simply test that one of the output of processData is exactly our pickups dataset from fixtures:

```
assert.deepEquals(
  processData(taxiData).pickups,
  pickups,
  "processData works as expected"
);
```

Of course, there's a lot more we could do: pass it inputs which are not well-formed and expect it to fail, pass it smaller datasets and show the result of that, etc.

<ul class='insert takeaways'>
<li>It's better to test actions from the reducer directly.</li>
<li>Beyond individual actions, whole scenarios can also be tested.</li>
</ul>



