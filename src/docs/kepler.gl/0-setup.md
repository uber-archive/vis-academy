
Before we go through the tutorial, let's make sure we have everything necessary in order to make this as smooth as possible.
This tutorial assumes a basic familiarity with Javascript and the command line, but otherwise it's not necessary to understand every step.
Feel free to ask questions if anything is unclear.
If you have problem with setting up the coding environment please check [here](#/installing-a-coding-environment/installing-tools-mac)

## 1. Cloning and Install

Clone our tutorial repository and go through the usual setup steps. NOTE: you
need to be running node **>=v6** locally.
```
git clone https://github.com/uber-common/vis-academy.git
cd vis-academy/src/demos/kepler.gl/0-starting-code

yarn --ignore-engines # or npm install (slower)
```

## 2. Setup mapbox access token and start the app

We created temporary token for you just for this code lab session. It will expire end of this week (June 1 2018).
```
export MapboxAccessToken=pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2poczJzeGt2MGl1bTNkcm1lcXVqMXRpMyJ9.9o2DrYg8C8UWmprj-tcVpQ

npm start
```

A page should automatically be opened in your browser, with a pretty simple app (for now!).

Note that the repository you cloned also contains all the content and code of this tutorial, and you may run it locally if you want (repeat the last two steps from above from vis-academy/).

## 3. How this tutorial works

In this tutorial, you will build a kepler.gl application from scratch by importing the kepler.gl react component and using existing data and map configuration (both provided). 

In each lesson, we'll highlight what we'll cover, then we'll go through the code examples - copying the examples is how we'll build the app step by step. Some parts of the lessons are skippable - you can move to the next session and still have a functional app at the end. 

Feel free to explore and experiment as you copy the code examples, you can find working code that correspond to the start of each lesson in the repository.

We'll end each lesson with key takeaways and further reading.

## 4. Start Coding!

You should see the project sturcture of `0-starting-code` folder like this:
```
  src/
    demos/
    	kepler.gl/
		  0-starting-code/
			src/
			.babelrc
			index.html
			package.json
			README.md
			webpack.config.js
			yarn.lock
```

 - ./src: will be the folder that holds all your changes as you go through the tutorial.
 - ./.babelrc: the babel configuration to transpile es6/jsx code to javascript and 
 - ./index.html: the wireframe of the app
 - ./package.json: the manifest about the application and dependencies.
 - ./README.md: instructions about how to run this application.
 - ./webpack.config.js: basic [Webpack](https://webpack.github.io/) server settings.
 - ./yarn.lock: lock file for [yarn](https://yarnpkg.com/en/).

We also prepared the starting code for each step in case you join in the middle of the class.
Each folder has the same structure, the only thing you need to do is to follow the steps and edit the code in `src/` folder.

README file contains important information on how to run the demo app using a Mapbox API token.

Now You can open your text editor with the following file:

```
src/demos/kepler.gl/0-starting-code/src/app.js
```

Next, you can head to the next step:
[Import Kepler.gl](#/kepler.gl/1-import).
