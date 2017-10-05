Before we start, let's make sure we have everything necessary to run our app.

* [Setup instructions on Mac](#/installing-a-coding-environment/installing-tools-mac)
* [Setup instructions on Windows](#/installing-a-coding-environment/installing-tools-windows)

This tutorial assumes a basic familiarity with Javascript and the command line,
and you'll get the most out of the lessons if you already have experience with React
but otherwise it's not necessary to understand every step. Feel free to ask
questions if anything is unclear.

## 1. Running
Open a terminal window and change to the custom-layers directory.

NOTE: you need to be running node **>=v6** locally.

```
cd vis-academy/src/demos/custom-layers/starting-code

yarn # or npm install (slower)
npm start
```

A page should automatically open in your browser, with a base map showing New York City and a scatterplot showing taxi pickup locations.

Note that the repository you cloned also contains all the content and code of
this tutorial, and you may run it locally if you want (repeat the last two steps
from above from vis-academy/).

## 2. How this tutorial works

In this tutorial, you will build a few layers from scratch, learning different techniques that make it easy to adapt deck.gl to your needs.

In each lesson, we'll highlight what we'll cover, then we'll go through the code examples - copying the examples is how we'll build the app step by step. Some parts of the lessons are skippable - you can move to the next session and still have a functional app at the end.

Feel free to explore and experiment as you copy the code examples, you can find working code that correspond to the start of each lesson in the repository.

We'll end each lesson with key takeaways and further reading.

## 3. Start Coding!

You can now open your text editor with the following file:

```
src/demos/custom-layers/starting-code/src/app.js
```

It's an empty component! `starting-code` will be the folder that holds all your
changes as you go through the tutorial. You can now head to the next step:
[Combination Layer](#/custom-layers/1-combination-layer).
