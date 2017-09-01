Before we go through the tutorial, let's make sure we have everything necessary
in order to make this as smooth as possible.

## 1. Getting a Mapbox Token

You need a free Mapbox token in order to get the map to load.
Head over to [Mapbox](https://www.mapbox.com/help/define-access-token/) and get
one now.

Once you have it, set the token in your environment (whichever terminal you will
use to run the tutorial from).
```
export MapboxAccessToken=<token>
```

## 2. Cloning and Running Starting Code

In order to do live coding, you can use the example starting code we provide.
Clone our tutorial repository and go through the usual setup steps. NOTE: you
need to be running node **>=v6** locally.
```
git clone https://github.com/uber-common/vis-tutorial.git
...
cd vis-tutorial
npm install OR yarn
...
npm run start
```

A page should automatically be opened in your browser, which looks very similar
to the page you see now.

**But with a caveat**

There should now be a new link called **Live Code Playground** right after
**Welcome!**. This is rendering our starting code, which we will build into
a nice visualization app as the tutorial progresses. Every change you make will
be rendered on this page (assuming you keep the local node instance running).

You can press the tilde (~) key anytime to fullscreen the app that will be displayed here.

## 3. Open Starting Code in your Text Editor

You can now point your text editor to the following file:

```
vis-tutorial/demos/starting-code/app.js
```

It's an empty component! `starting-code` will be the folder that holds all your
changes as you go through the tutorial. You can now head to the next step:
[Starting With A Map](https://uber-common.github.io/vis-tutorial/#/react-map/starting-with-map).
