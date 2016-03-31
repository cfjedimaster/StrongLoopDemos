var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

var exphbs = require('express-handlebars');

// We customize layoutsDir and views (few lines below) due to confusion of paths by default
var hbs = exphbs.create({
	defaultLayout:'main',
	layoutsDir:__dirname+'/views/layouts',
	helpers:{
		ifSelected:function(product,partid) {
			if(!product) return '';
			var parts = product.parts();
			for(var i=0;i<parts.length;i++) {
				if(String(parts[i].id) === String(partid)) {
					return 'selected';				
				}
			}
			return '';
		}
	}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views',__dirname+'/views');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
