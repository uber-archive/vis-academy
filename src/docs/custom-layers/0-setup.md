Before we start, let's make sure we have everything necessary to run our app.

This tutorial assumes a basic familiarity with Javascript and the command line,
but otherwise it's not necessary to understand every step. Feel free to ask
questions if anything is unclear.

## 1. Getting a Mapbox Token

You need a free Mapbox token in order to get the map to load.
Head over to [Mapbox](https://www.mapbox.com/help/define-access-token/) and get
one now if you don't already have one.

Once you have a token, you will need to set it in your environment (whichever
terminal you are using to run the tutorial).

For example, on Linux and Mac, you would run:

```
export MapboxAccessToken=<token>
```

For Vis 2017 tutorial, here is the token you can use, it will be valid for this week
```
export MapboxAccessToken=pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2o4OW90ZjNuMDV6eTMybzFzbmc3bWpvciJ9.zfRO_nfL1O3d2EuoNtE_NQ
```

## 2. Cloning and Running
You should have git, node >= 6, and either yarn or npm installed.

Clone our tutorial repository and open the new directory.
```
git clone https://github.com/uber-common/vis-academy.git
cd vis-academy/src/demos/custom-layers/starting-code

yarn # or npm install (slower)
npm start
```

A page should automatically open in your browser, with a base map showing New York City and a scatterplot showing taxi pickup locations.

Note that the repository you cloned also contains all the content and code of
this tutorial, and you may run it locally if you want (repeat the last two steps
from above from vis-academy/).

## 3. How this tutorial works

In this tutorial, you will build a few layers from scratch, learning different techniques that make it easy to adapt deck.gl to your needs.

In each lesson, we'll highlight what we'll cover, then we'll go through the code examples - copying the examples is how we'll build the app step by step. Some parts of the lessons are skippable - you can move to the next session and still have a functional app at the end.

Feel free to explore and experiment as you copy the code examples, you can find working code that correspond to the start of each lesson in the repository.

We'll end each lesson with key takeaways and further reading.

## 4. Start Coding!

You can now open your text editor with the following file:

```
src/demos/custom-layers/starting-code/src/app.js
```

It's an empty component! `starting-code` will be the folder that holds all your
changes as you go through the tutorial. You can now head to the next step:
[Combination Layer](#/custom-layers/1-combination-layer).
