In this module, we're going to write a series of tests for our [geospatial app](#/building-a-geospatial-app/) that we built in another module.
We are using this app as an example, as it's neither too complex nor too simple, but this module isn't specially about visualization. Rather, it will show how to write sensible tests for a React/Redux application.

## Who is this for?

The class assumes that you have some familiarity with the React concepts like componnets and lifecycle methods, and, for the last section, with Redux as well (stores, actions, reducers, etc.). However, it doesn't require you to know anything about testing and will explain everything from the ground up. 

## Setup 

You should have git, node >= 6, and either yarn or npm installed.

Clone our tutorial repository and open the new directory.
```
git clone https://github.com/uber-common/vis-academy.git
cd vis-academy/src/demos/testing-a-geospatial-app/0-starting-code

yarn # or npm install (slower)
```

For the class, you won't really have to run the app for which we will be writing tests. You can see it work [here](#/building-a-geospatial-app/6-linking-it-all) anyway. If you do want to run it, you will need to get a Mapbox token. Checkout [Installing a coding environment](#/installing-a-coding-environment/) for all the steps.

## How this tutorial works

In this tutorial, you're going to start from the code in the "0-starting-code" directory, and follow instructions on each section. If you skip a section, you can always get the code - every folder in /src/demos/testing-a-geospatial-app/ contains the code at the end of the corresponding section. 

## Presentation of the app

We've converted the app of the Building a geospatial environment into a [React/Redux](https://github.com/reactjs/react-redux) app.

Originally, this app didn't use a store and its main component, App, had a state. It also had methods that modified that state, and that were passed to other components as props. Our app is simple enough that it can be organized like that.

However, beyond a certain level of complexity, React apps are very likely to have a store, and if we are to explore testing, we can't really limit ourselves to the simplest of scenario. So instead, we've built a simple redux app.

The 6 methods that affected the state of App are now recreated as actions. The App component no longer has a state or methods, but we've splitted it in two: a container, that gets some properties and actions from the store, and a pure rendering component, which receives them as props. We are using the react-redux bindings, connect and Provider, to make the redux store available to our components.

As a redux-powered app, our new app does exactly the same as its previous incarnation - nothing more, nothing less.

## Are you ready to test?

If so, head towards the next section: [smoke tests](#testing-a-geospatial-app/1-smoke-tests).
