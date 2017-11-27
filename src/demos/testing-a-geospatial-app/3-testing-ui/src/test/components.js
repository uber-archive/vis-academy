import React from "react";
import { mount, shallow } from "enzyme";
import sinon from "sinon";
import test from "tape-catch";
import App from "../app";
import Charts from "../charts";

import { pickups } from "./fixtures";

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
