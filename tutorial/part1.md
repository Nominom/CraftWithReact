I recently built a Craft CMS website and decided to use React as the front-end. I was inspired to make this tutorial to help you get started on your own Craft + React project by building a small blog site. 

*If there are punctuation marks in funny places or some weird phrases, I'll apologize in advance. English is not my first language.*

I recommend having some basic knowledge of React, html and css, but complete beginners can also follow along. You don't need to know anything about Craft CMS beforehand.

This tutorial was made with the following versions:
* node - 13.12.0
* React - 16.13.1
* composer - 1.10.5
* php - 7.4.5
* Craft - 3.4.18
* Element API - 2.6.0
* Redactor - 2.6.1

If something major changes in future versions, something in this tutorial might break or not work as expected.

All the code for this tutorial is available on [github](https://github.com/Nominom/CraftWithReact).

### What is Craft CMS?

On their [website](https://craftcms.com/), Pixel & Tonic say that 

> "Craft is a flexible, user-friendly CMS for creating custom digital experiences on the web and beyond." 

In other words, it's a content management platform where everything is customizable, and you're in control of your content and presentation. You can learn more about craft by visiting the [Craft CMS docs](https://docs.craftcms.com).

For people who have used WordPress, the editorial experience is quite similar, with the difference being that you can choose yourself what fields your posts and pages will have. Another difference is, that there are no premade templates to choose from. You're in charge of the front-end.

### Why react?

Now some of you might wonder, why would I use React as the front-end for my Craft site, when I can just use Craft's built-in twig template functionality?

The main reason I would argue, is that React makes your front-end development a much less painful experience, than trying to develop twig templates with some css and javascript files. With react, you have easy access to things like [styled components](https://styled-components.com/), [Tailwind](https://tailwindcss.com/) and thousands of other packages to help you make the website you want to make.

Another reason for React is performance. When your browser requests a page, it has to load the main bundle for the first time, sure. And that can slow down the first load of the site. But once the javascript bundle is loaded, loading new pages is blazing fast because all your browser has to do, is to fetch the next page as a json file, which is much lighter than fetching a whole new html document every time you navigate to a new page.

### Step 0 - Getting started

If you need a refresher on React or you're a complete beginner, I recommend checking out the [Full Stack Open](https://fullstackopen.com/) course by University of Helsinki, which will get you started on React development. You don't need to know React to copy and paste along, but knowing the very basics is recommended to get a better understanding of what we're doing.

You will most likely need [php](https://www.php.net/) 7.x+ and [composer](https://getcomposer.org/) installed on your machine. If you don't want to do that there are ways to work around it, like developing through a remote connection to the server. In that case, you should have an ftp connection to your target server and have WinSCP or similar sync your project folder to the server. You should at least have composer installed on the target machine, and an ssh connection to run the commands.

You'll also need [node](https://nodejs.org/) and either [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/) installed on your development machine to install node packages. For this tutorial I'll be using npm.

An sql or postgres database is required, running either locally or on a remote server.

Verify that everything is working by running these commands:
```console
$ php -v
$ composer -v
$ node -v
$ npm -v
```


### Step 1 - Installing Craft CMS

Start by creating a new folder in the directory of your choosing and going in.

```console
$ mkdir CraftWithReact
$ cd CraftWithReact
```
Next, we'll use composer to install Craft by typing
```console
$ composer create-project craftcms/craft ./
```
After composer has done it's job, we should find that the directory now contains a freshly installed Craft project.

The next step is to set up the .env file. Currently, it should look something like this:
```
# The environment Craft is currently running in 
# ('dev', 'staging', 'production', etc.)
ENVIRONMENT="dev"

# The secure key Craft will use for hashing and encrypting data
SECURITY_KEY="e3xGl7yfn-IvcdI0E1wiGAt6d1tGd4qr"

# The Data Source Name (“DSN”) that tells Craft how to connect to the database
DB_DSN=""

# The database username to connect with
DB_USER="root"

# The database password to connect with
DB_PASSWORD=""

# The database schema that will be used (PostgreSQL only)
DB_SCHEMA="public"

# The prefix that should be added to generated table names 
# (only necessary if multiple things are sharing the same database)
DB_TABLE_PREFIX=""
```

The main thing to change here is to input your sql or postgres database details. If you have a local mysql database running, edit your file to look something like this:
```
# The environment Craft is currently running in 
# ('dev', 'staging', 'production', etc.)
ENVIRONMENT="dev"

# The secure key Craft will use for hashing and encrypting data
SECURITY_KEY="e3xGl7yfn-IvcdI0E1wiGAt6d1tGd4qr"

# The Data Source Name (“DSN”) that tells Craft how to connect to the database
DB_DSN="mysql:host=localhost;port=3306;dbname=craftcms"

# The database username to connect with
DB_USER="root"

# The database password to connect with
DB_PASSWORD="password"

# The database schema that will be used (PostgreSQL only)
DB_SCHEMA="public"

# The prefix that should be added to generated table names 
# (only necessary if multiple things are sharing the same database)
DB_TABLE_PREFIX="craft"

```

Next up, we need to tell composer that we need to use some packages for craft. Mainly, ImageMagic, Element API and Redactor.

Open up composer.json file, and add the following lines: 
```JSON
{
	"require": {
		"craftcms/cms": "^3.4.0",
		...
		"ext-imagick": "*",
		"craftcms/redactor": "*",
		"craftcms/element-api": "*"
	},
	"require-dev": {
		...
```

Then, we need to run composer update to update the composer.lock file.
```console
$ composer update
```

### Step 2 - Creating a node project

Run the npm init command in the project directory.
```console
$ npm init
```
The command will run you through creating a node project, but you can pretty much leave everything as default if you like.

After we've initialized our node project, let's install some packages!
```console
$ npm install --save react react-dom axios
$ npm install --save-dev webpack webpack-cli 
$ npm install --save-dev @babel/core babel-loader @babel/preset-env @babel/preset-react 
```

If you have a git repository, you should add the following lines to your **.gitignore**:

```
...
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# misc
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
```
#### Webpack and babel

Webpack will handle the packing of our javascript files, and babel will compile our ES6 code to be more compatible with older browsers.

To set up Webpack, we need to create a **webpack.config.js** file, with the following contents: 

```js
const path = require('path');
module.exports = {
	// define entry file and output
	entry: {
		main: './src/index.js',
	},
	output: {
		path: path.resolve('./web/res'),
		filename: '[name].js'
	},
	// define babel loader
	module: {
		rules: [
			{ test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ }
		]
	}
};
```

This sets up our webpack build, so that our entry point will be located in the **./src/index.js'** file, and the final output will be in **./web/res/** folder. 

The **web/** folder is the folder where craft expects its static resources to be in. If your hosting environment wants this folder to be named something else like **html/**, **public_html/** or **public/**, craft should be fine with it but remember to reflect that change here.

To set up Babel we need to create a **.babelrc** file, with the following contents: 
```JSON
{
	"presets": [
		"@babel/preset-env",
		"@babel/preset-react"
	]
}
```

And finally we add the following lines to the **package.json** file:
```JSON
{
	...
	"scripts": {
		...
		"dev": "webpack --watch --mode development",
		"build": "webpack --mode production"
	},
	...
```

#### Local php dev server (Optional)

If you want to test Craft locally without installing apache, nginx or IIS, you can install [node-php-awesome-server](https://www.npmjs.com/package/node-php-awesome-server) to run Craft locally in node.

*Running php in node is very slow, so the speeds you see with this setup are snail pace compared to what you'll see in production.*

```console
$ npm install --save-dev node-php-awesome-server
```

Next, create a **devserver.js** file with the following contents:
```js
const nodePhpAwesomeServer = require('node-php-awesome-server');

const php = nodePhpAwesomeServer({
	port: 3001,
	root : 'web',
	ini_set: {
		max_execution_time: 280
	},
	output: {
		os: true,
		browser: true,
		device: true,
		reqTime: true
	},
	clustersSet: 'auto',
	phpPerCluster: 2

});

php.on('close', () => {
	console.log('php server closed');
});

php.on('connect', () => {
	console.log('All up and running');
});
```

And add the following line to your **package.json** file: 
```JSON
{
	...
	"scripts": {
		...
		"dev": "webpack --watch --mode development",
		"build": "webpack --mode production",
		"startdev": "node devserver.js"
	},
	...
```

Now, if you run the command
```console
$ npm run startdev
```
... you should be able to access Craft from *http://localhost:3001*

Note that the page will most likely throw a 503 Service Unavailable Error, because we have not yet completed Craft setup.


### Step 3 - Finalizing craft setup

If you have your web server running and pointing to the project **web/** directory, you should be able to access the craft installer by navigating to *http://localhost:3001/admin/install* on your web browser.

Some people might experience some missing php plugins here, which craft will tell you about. You can usually enable them by uncommenting the corresponding line in your **php.ini** file.

If all is good, and you see the "Install Craft" button, just follow the setup process by creating a user and setting up the page name and base url.

### Step 4 - React Hello world

To get React working with craft, we need to to set up our twig template to load our javascript bundle.

In the templates folder, create or overwrite **index.twig** file with the following contents:
```html
<!DOCTYPE html>
<html lang="{{ craft.app.language }}">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
		<meta charset="utf-8"/>
		<title>{{ siteName }}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover"/>
		<meta name="referrer" content="origin-when-cross-origin"/>
	</head>
	<body>
		<div id="root"></div>
		<script type="text/javascript" src="/res/main.js"></script>
	</body>
</html>
```

If you need to add any css files to your project, just plop them here as well.

After that, create a new folder called **src/** to the base directory of the project.
```console
$ mkdir src
```

Create our entry **src/index.js** file with the following contents: 
```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
	<App />,
	document.getElementById('root')
)

```

After that, create **src/App.js** file with these contents:
```js
import React from 'react'

const App = () => {
	return(
		<div>
			Hello World!
		</div>
	)
}

export default App
```

And then, build the bundle:
```console
$ npm run build
```

If we start our development server again, and navigate to http://localhost:3001/ we should see a little "Hello World!" pop up.

Join me in the next one, where we setup element API and build a small blog website in Craft with our setup.