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
		//get all parts so we can use in the form
		server.models.Part.find({order:'name asc'}).then(function(parts) {
			
			server.models.Product.findById(req.params.id,{include:'parts'}).then(function(product) {
				if(!product && req.params.id != 0) return res.redirect('/');
				res.render('edit',{product:product, parts:parts});
			}).catch(function(err) {
				console.log('Error in edit route', err);	
			});
			
		});
	});

	router.get('/products/delete/:id', function(req,res) {
		/*
		Can't just use deleteById, because first we have to get our products and remove them.
		*/
		
		server.models.Product.findById(req.params.id,{include:'parts'}).then(function(product) {
			if(!product) return res.redirect('/');
			var parts = product.parts();
			var mods = [];
			if(parts && parts.length) {
				parts.forEach(function(oldPart) {
					var p = new Promise(function(fulfill, reject) {
						product.parts.remove(oldPart).then(function(err) {
							fulfill();
						});
					});
					mods.push(p);					
				});	
			}

			Promise.all(mods).then(function() {
				server.models.Product.deleteById(req.params.id).then(function(err) {
					res.redirect('/');
				});
			});


		});		
		
	});
		
	router.post('/products/save', function(req, res) {
		//one to one btn form and model
		var product = req.body;
		if(product.id === '') delete product.id;
		//remove parts
		var selectedParts = [];
		if(product.parts) {
			//so req.body turns one into a string and two into an array
			if(typeof product.parts === 'string') {
				selectedParts[0] = product.parts;
			} else {
				selectedParts = product.parts;
			}
			delete product.parts;
		}
		console.log('selected parts is '+selectedParts);
		
		/*
		So new logic is - we need to handle removing existing parts and re-adding
		We could make it smart, only remove things not needed, but by removing all
		we can make the logic easier (imo)
		
		So I wait till my save so I have a Product ob
		Then remove all
		Then add
		
		v2: Nope, we can't remove all and then add cuz they are all async, and it's
		possible for me to add X before remove X is called and we end up w/o X
		*/		
		server.models.Product.upsert(product).then(function(product) {

			/*
			At this point, 'product' is a stored object, whether it was new or not
			But we don't have the parts cuz you can't upsert and ask for it back, so we'll get a new one
			*/
			server.models.Product.findById(product.id,{include:'parts'}).then(function(loadedProduct) {

				var parts = loadedProduct.parts();
				var mods = [];
				if(parts && parts.length) {
					console.log('old ones to remove');
					parts.forEach(function(oldPart) {
						if(selectedParts.indexOf(oldPart.id) === -1) {
							console.log('killing '+oldPart);		
							var p = new Promise(function(fulfill, reject) {
								loadedProduct.parts.remove(oldPart).then(function(err) {
									console.log('in the remove cb, err? ',err);
									fulfill();
								});
							});
							mods.push(p);					
						}
					});	
				}

				if(selectedParts.length) {
					selectedParts.forEach(function(newPart) {
						console.log('adding newPart '+newPart);
						var p = new Promise(function(fulfill, reject) {
							server.models.Part.findById(newPart).then(function(part) {
								loadedProduct.parts.add(part).then(function() {
									fulfill();
								});
							});
						});
						mods.push(p);
					});
				}
				
				Promise.all(mods).then(function() {
					console.log('in theory, done with all the removals');
					console.log('testing loaded prod', loadedProduct.parts().length);
					res.redirect('/');
				});
				
			});
			
		}).catch(function(e) {
			console.log('Error in upsert', e);	
		});	
				
	});

	router.get('/parts/edit/:id', function(req,res) {
		server.models.Part.findById(req.params.id).then(function(part) {
			if(!part && req.params.id != 0) return res.redirect('/');
			res.render('editpart',{part:part});
		});
	});

	router.get('/parts/delete/:id', function(req,res) {
		
		server.models.Part.findById(req.params.id,{include:'products'}).then(function(part) {

			if(!part) return res.redirect('/');
			var products = part.products();
			var mods = [];
			if(products && products.length) {
				products.forEach(function(oldProduct) {
					var p = new Promise(function(fulfill, reject) {
						part.products.remove(oldProduct).then(function(err) {
							fulfill();
						});
					});
					mods.push(p);					
				});	
			}

			Promise.all(mods).then(function() {
				server.models.Part.deleteById(req.params.id).then(function(part) {
					res.redirect('/');
				});
			});
				
		});

	});
		
	router.post('/parts/save', function(req, res) {
		//one to one btn form and model
		var part = req.body;
		if(part.id === "") delete part.id;
		server.models.Part.upsert(part).then(function() {
			res.redirect('/');
		});
		
	});

	server.use(router);
};
