module.exports = function(server) {
	
	var router = server.loopback.Router();
	
	router.get('/', function(req,res) {

		server.models.Product.find({order:'name asc'}).then(function(products) {
			console.dir(products);
			server.models.Part.find({order:'name asc'}).then(function(parts) {
				res.render('index',{products:products,parts:parts});
			});
		});

	});

	router.get('/products/edit/:id', function(req,res) {
		server.models.Product.findById(req.params.id).then(function(product) {
			if(!product && req.params.id != 0) return res.redirect('/');
			res.render('edit',{product:product});
		});
	});

	router.get('/products/delete/:id', function(req,res) {
		server.models.Product.deleteById(req.params.id).then(function(product) {
			res.redirect('/');
		});
	});
		
	router.post('/products/save', function(req, res) {
		//one to one btn form and model
		var product = req.body;
		server.models.Product.upsert(product).then(function() {
			res.redirect('/');
		});
		
	});

	router.get('/parts/edit/:id', function(req,res) {
		server.models.Part.findById(req.params.id).then(function(part) {
			if(!part && req.params.id != 0) return res.redirect('/');
			res.render('editpart',{part:part});
		});
	});

	router.get('/parts/delete/:id', function(req,res) {
		server.models.Part.deleteById(req.params.id).then(function(part) {
			res.redirect('/');
		});
	});
		
	router.post('/parts/save', function(req, res) {
		//one to one btn form and model
		var part = req.body;
		server.models.Part.upsert(part).then(function() {
			res.redirect('/');
		});
		
	});

	server.use(router);
};
