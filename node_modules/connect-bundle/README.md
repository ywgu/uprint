# connect-bundle

Middleware that allows you to configure client-side JavaScript and CSS bundles, and use them conditionally based on current environment ("development", "production", etc.).

## What it Does

Allows you to specify bundles of JavaScript and CSS that are to be refrenced in your views, usually in a layout.  If running in development mode, the contents of a bundle will be used, otherwise the bundle will be used.  Allows you to specify multiple bundles, and choose which one to use.

## What it Does Not Do

It does not actually _perform_ the bundling: for that, you must rely on another library such as [grunt-contrib-uglify](https://github.com/gruntjs/grunt-contrib-uglify) or [grunt-contrib-cssmin](https://github.com/gruntjs/grunt-contrib-cssmin).  You can also use [grunt-hashres](https://github.com/Luismahou/grunt-hashres) to hash your bundles, and have it automatically update your bundle names accordingly.  Note that Grunt (or Grunt plugins) are no way required; I am just using them as examples here.

## Installation

Install using npm:

```
$ npm install connect-bundle --save
```

## Usage

```javascript

// cheesy mobile detection
app.use(function(req, res, next){
	var ua = req.headers['user-agent'] || '';
	req.isMobile = !!ua.match(/mob/i);
});

var bundler = require('connect-bundle')({
	
	// choose the property that will be added 
	// to res.locals (defaults to '_bundles')
	contextProperty = 'myBundles',

	// specify your budnles
	bundles: {
		clientJavaScript: {
			desktop: {
				file: '/js/acme-desktop.min.js',
				location: 'head',
				contents: [
					'/js/acme-main.js',
					'/js/acme-this.js',
					'/js/acme-that.js',
				]
			},
			mobile: {
				file: '/js/acme-mobile.min.js',
				location: 'beforeCloseBody',
				contents: [
					'/js/acme-main.js',
					'/js/acme-that.js',
					'/js/acme-mobile.js'
				]
			},
		},
		clientCss: {
			desktop: {
				file: '/css/acme-desktop.min.css',
				contents: [
					'/css/acme-main.css',
					'/css/acme-desktop.css',
					'/css/acme-print.css',
				]
			}
			mobile: {
				file: '/css/acme-mobile.min.css',
				contents: [
					'/css/acme-main.css',
					'/css/acme-mobile.css',
				]
			}
		}
	},
	use: {
		desktop: function(req,res) {
			return !req.isMobile;
		}
		mobile: function(req,res) {
			return req.isMobile;
		}
	}
});

// set your preferred view engine first....
app.engine('handlebars', require('express3-handlebars')());
app.set('view engine','handlebars');

app.use(bundler);
```

In this example, we've configured two distinct bundles, `desktop` and `mobile`.  Bundles can be named whatever you like; this is just an example.  You can have as many or as few bundles as you want.  For JavaScript, you also must specify a location, such as `'head'`, `'afterBodyOpen'` or `'afterBodyClose'` (these are common places to include JavaScript).  It is assumed that all CSS will be referenced in `<head>`, so CSS bundles don't have a location.

Now in your views (this example uses Handlebars):

```
<head>
	{{#each myBundles.js.head}}
		<script src="{{.}}"></script>
	{{/each}}
	{{#each myBundles.css}}
		<link rel="stylesheet" href="{{.}}"></script>
	{{/each}}
</head>
<body>
	<h1>Acme</h1>
	<p>Content goes here.</p>

	<script src="http://code.jquery.com/jquery-2.0.2.min.js"></script>
	{{#each myBundle.js.beforeBodyClose}}
		<script src="{{.}}"></script>
	{{/each}}
</body>
```

If you run in development mode, the individual scripts that comprise the bundles will be used, aiding in debugging.  If you run in any other mode, the bundles will be used.
