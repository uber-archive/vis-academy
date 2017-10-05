# Installing a coding environment - Windows

Before you get started with the lessons, you need to have a few tools installed on your machine. Here are detailed steps to get everything you need on Windows. If you are using MacOS, checkout [our MacOS guide instead](#/installing-a-coding-environment/installing-tools-mac).

The following instructions are written for a completely new machine, assuming that nothing you need is installed yet.

The purpose of this section is not to get you the fanciest code environment with all bells and whistles - which has a lot to do with personal preferences, anyway - but to make sure you have enough to get going. For everything we're going to install I've added simple commands to check that this step is cleared; if you're having a problem on a specific step please open a [GitHub issue](https://github.com/uber-common/vis-academy/issues/new), and you can find answers to most issues online.

## Get a text editor

First things first is to make sure you have a robust text editor. I am partial to [Sublime Text](https://www.sublimetext.com/3) but there are lots of other good options like [Visual Studio Code](https://code.visualstudio.com/), [Atom](https://atom.io) and many others.

## Get Node.js

The next step is to get [node.js](https://nodejs.org/en/download/). Simply follow the link to the Windows installer (msi 64 bit, or 32 bit on older machines or if 64 bit installer fails) and follow instructions with default options.

When you are done, find the node.js command prompt in your start menu and type:

```
node --version
```

to make sure that node has installed correctly. This command should return the version of the node.js you have installed.

Now run:
```
npm install --global yarn
```

If anything fails at this point, please open a [GitHub issue](https://github.com/uber-common/vis-academy/issues/new).

## Get Git

Now, download [git for windows](https://git-scm.com/) and again, go through the installation with default settings.

Likewise, when you are done, from the same command prompt window, type:

```
git --version
```

and veryify that it's installed.

## Get a Mapbox token

If you are going to follow a tutorial that uses React-Map-GL, you will probably need a Mapbox token. Go to [Mapbox.com](http://mapbox.com) and sign up or sign in, then go to your account, and finally, click on [API access tokens](https://www.mapbox.com/studio/account/tokens/).

Either create a new token or copy the one you want to use.

Then, using our text editor from the first step, we're going to edit the file nodevars.bat found in the same folder where node.js was installed (probably C:\Program Files\nodejs).

After line 4, which should be something like
```
set "PATH=%APPDATA%\npm;%~dp0;%PATH%"
```

you're going to type

```
set "MapboxAccessToken=[your mapbox access token goes here]"
```

(you'll replace [your mapbox access token goes here] by the mapbox access token you just created or copied, and there's no brackets.)

Save this file.
It may be protected, in which case find it in the file explorer, remove security options and save again.

In your node.js command prompt window, type `nodevars`.

Then type:

```
set
```

And you should see your  `MapboxAccessToken`.
Each time you will reopen your node.js command prompt, MapboxAccessToken will be already set.

Next, we're going to download the code files you need to follow the lesson. [Continue the setup here](#/installing-a-coding-environment/downloading-code-examples). (Note - this last step is the same for Mac and Windows)

