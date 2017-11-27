import test from "tape-catch";
import { highlightHandler, processData, reducer } from "../reducer";
import { highlight, select } from "../actions";
import taxiData from "../../../../data/taxi";
import { pickups } from "./fixtures";

test("Testing handlers", assert => {
  assert.deepEquals(
    highlightHandler({}, { payload: 1 }),
    { highlightedHour: 1 },
    "highlightHandler updates state"
  );

  assert.equals(
    reducer({}, highlight(1)).highlightedHour,
    1,
    "action creator is a more reliable way to test this"
  );

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

  assert.deepEquals(
    processData(taxiData).pickups,
    pickups,
    "processData works as expected"
  );

  assert.end();
});
