In the previous steps, we've installed: 
- a code editor,
- node.js and npm,
- git,

we've obtained a mapbox token and we made sure it will be accessible each time you need it.

If you haven't accomplished this yet, that's how you do it: 
- [on Windows](#/installing-a-coding-environment/installing-tools-windows)
- [on MacOS](#/installing-a-coding-environment/installing-tools-mac)

Next, we are going to get the code files that we need. 

# Cloning the repository

All the code examples are stored on a github repository. To be able to follow the lessons, you will need to modify these examples on your local machine, which is why you need to get your own, local copy.

In your node.js command prompt window, type: 

```
git clone https://github.com/uber-common/vis-academy.git
```

which will download your own copy from github.

After this is done, a copy of the vis-academy repo should be in the vis-academy folder. 

# Verifying that everything works

We are going to build the app from the first lesson, "Building a Geospatial App", to make sure that everything works:

Type:

```
cd vis-academy/src/demos/building-a-geospatial-app/starting-code
npm install
```

This step can take a minute or two as all the dependencies are downloaded. When you have access to the prompt again, type:

```
npm run start
```

And open your browser at this address: http://localhost:3030/ - though a new browser should already be open.

If you see:
![empty app - Edit me!](images/setup/emtpy-app.png)

Congratulations! You are ready to enroll to the academy.
If the app cannot find your Mapbox token, it would let you know. Go back to the previous step and make sure it's set in your environment variables. 
