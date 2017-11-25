## Code coverage

Code coverage is one measure of how well your code is tested. When computing coverage, you are counting how many branches of your code are are taken into account by tests.

We're going to add the nyc module:

```
npm install nyc --save-dev
```

and add this line in our package.json scripts:

```
"cover":
  "nyc --reporter html --reporter cobertura --reporter json-summary npm test"
```

You're all set!
now, in the CLI, let's type:

```
npm run cover
```

Our tests are going to run again, but on top of that, a "coverage" folder is going to be created in the folder where you have your package.json. Locate that folder and open the index.html file inside of it in your browser.

You'll be able to see that for now, our 4 tests cover 42.59% of our statements and 44.23% of our lines. The more tests we're going to write, the more those numbers will go up.

Code coverage is helpful but is not the endgame. It's much easier to achieve a great code coverage than to write helpful tests!

Let's continue to the next section: [testing UI](#testing-a-geospatial-app/3-testing-UI).


