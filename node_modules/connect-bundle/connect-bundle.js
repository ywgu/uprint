module.exports = function(config) {

	if(!config.contextProperty) config.contextProperty = '_bundles';

	return function(req, res, next){
		var bundles = config.bundles;
		var bundleNames;
		var locals = res.locals[config.contextProperty] = {};
		var env = process.env.NODE_ENV;
		// assume unset NODE_ENV => development
		var dev = !env || env==='development';

		// JavaScript
		bundleNames = Object.keys(bundles.clientJavaScript);
		locals.js = {};	
		bundleNames.forEach(function(bundleName){
			if(config.use && !config.use[bundleName](req,res)) return;
			var bundle = bundles.clientJavaScript[bundleName];
			if(!locals.js[bundle.location]) locals.js[bundle.location] = [];
			if(dev)
				locals.js[bundle.location] = Array.prototype.concat.call(locals.js[bundle.location], bundle.contents);
			else
				locals.js[bundle.location].push(bundle.file);
		});
		// CSS
		bundleNames = Object.keys(bundles.clientCss);
		locals.css = [];
		bundleNames.forEach(function(bundleName){
			if(config.use && !config.use[bundleName](req,res)) return;
			var bundle = bundles.clientCss[bundleName];
			if(dev)
				locals.css = Array.prototype.concat.call(locals.css, bundle.contents);
			else
				locals.css.push(bundle.file);
		});
		next();
	};

}
