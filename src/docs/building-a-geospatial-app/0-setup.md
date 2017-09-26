Before we go through the tutorial, let's make sure we have everything necessary
in order to make this as smooth as possible.

## 1. Getting a Mapbox Token

You need a free Mapbox token in order to get the map to load.
Head over to [Mapbox](https://www.mapbox.com/help/define-access-token/) and get
one now if it's not already the case.

Once you have it, set the token in your environment (whichever terminal you will
use to run the tutorial from).
```
export MapboxAccessToken=<token>
```

## 2. Cloning and Running

In order to do live coding, you can use the example starting code we provide.
Clone our tutorial repository and go through the usual setup steps. NOTE: you
need to be running node **>=v6** locally.
```
git clone https://github.com/uber-common/vis-tutorial.git
cd vis-tutorial/src/demos/starting-code

yarn # or npm install (slower)
npm start
```

A page should automatically be opened in your browser, with a pretty simple app (for now!).

Note that the repository you cloned also contains all the content and code of this tutorial, and you may run it locally if you want (repeat the last two steps from above from vis-tutorial/).

## 3. How this tutorial works

In this tutorial, you will build a full geospatial application from scratch, with maps, WebGL data overlays and interactive charts. 

In each lesson, we'll highlight what we'll cover, then we'll go through the code examples - copying the examples is how we'll build the app step by step. Some parts of the lessons are skippable - you can move to the next session and still have a functional app at the end. 

Feel free to explore and experiment as you copy the code examples, you can find working code that correspond to the start of each lesson in the repository.

We'll end each lesson with key takeaways and further reading.

## 4. Start Coding!

You can now open your text editor with the following file:

```
src/demos/building-a-geospatial-app/starting-code/app.js
```

It's an empty component! `starting-code` will be the folder that holds all your
changes as you go through the tutorial. You can now head to the next step:
[Starting With A Map](#/building-a-geospatial-app/1-starting-with-a-map).
