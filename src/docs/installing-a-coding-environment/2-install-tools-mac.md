# Installing a coding environment - MacOS

Before you get started with the lessons, you need to have number of tools installed on your machine. Here are detailed steps to get everything you need on MacOS. If you are using Windows, checkout [our Windows guide instead](#/installing-a-coding-environment/installing-tools-windows).

The following instructions are written for a completely new machine, assuming that nothing you'll need is installed yet.

The purpose of this section is not to get you the fanciest code environment with all bells and whistles - which has a lot to do with personal preferences, anyway - but to make sure you have enough to get going. For everything we're going to install I've added simple commands to check that this step is cleared; if you're having a problem on a specific step you can find answers online. 

## Get a text editor

First things first is to make sure you have a robust text editor. I am partial to [Sublime Text](https://www.sublimetext.com/3) but there are lots of other good options like [Visual Studio](https://code.visualstudio.com/), [Atom](https://atom.io) and many others. 

## Open terminal

Go to Finder, then in the top menu, select Go, then Utilities. You will find your terminal. Once open, right click on its icon in the dock bar and in the Options, select Keep in dock bar.

## Install Xcode command line tools

In your terminal prompt, type:

```
xcode-select --install
```

to install the Xcode command line tools. 

Then, agree to the license:

```
sudo xcodebuild -license
```

Type in your password, page through the document then finally at the end, type agree.

## Install homebrew

Homebrew is what will enable us to install node and git in a minute. 

In your terminal prompt, type (or, let's be real, copy/paste):
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

## Get Node.js

Still in your terminal prompt, type: 

```
brew install node
```

Then, at the prompt:

```
node -v
```

to make sure that it's installed. This command should return the version of the node.js you have installed. 

## Get Git

Now, type:

```
brew install git
```

Likewise, when you are done, from your node.js command prompt window, type: 

```
git --version
```

and veryify that it's installed. 

## Get a Mapbox token

If you are going to follow a tutorial that uses React-Map-GL, you will probably need a Mapbox token. Go to [Mapbox.com](http://mapbox.com) and sign up or sign in, then go to your account, and finally, click on API access tokens. 

Either create a new token or copy the one you want to use.

Next, we're going to put that token in your .bash_profile file so that you can access it when needed. 

.bash_profile doesn't necessarily exist, on a new machine, it has to be created. So either find it (in your home folder) or create a new file. 

There, add the line: 

```
export MAPBOX_TOKEN="[your mapbox access token]"
```

(you'll replace [your mapbox access token goes here] by the mapbox access token you just created or copied, and there's no brackets.)

Save this file - if you are creating a new .bash_profile file, it should go in your home folder. 
Close your terminal window and reopen it. 

Now type: 

```
echo $MAPBOX_TOKEN
```

And you should see your Mapbox access token. 
Each time you will reopen your terminal, your access token will be present in your environment. 

Next, we're going to download the code files you need to follow the lesson. [Continue the setup here](#/installing-a-coding-environment/downloading-code-examples). (Note - this last step is the same for Mac and Windows)

