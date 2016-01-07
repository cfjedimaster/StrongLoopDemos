module.exports = function(app) {
  // Install a `/` route that returns server status
  //var router = server.loopback.Router();
  //router.get('/', server.loopback.status());
  //server.use(router);
    
	app.get('/', function(req, res) {
		console.log('getting blog entries');
		app.models.entry.find({where:{released:true},order:'published desc'}).then(function(entries) {
			res.render('index',{entries:entries});
		});
	});
	
	app.get('/:year/:month/:day/:slug', function(req, res) {
		console.log('do blog entry');
		console.dir(req.params);
		//create an upper and lower date range
		var lowerDate = new Date(req.params.year, req.params.month-1, req.params.day);
		var upperDate = new Date(lowerDate);
		upperDate.setDate(upperDate.getDate()+1);
		app.models.entry.findOne({where:{
			released:true,
			slug:req.params.slug,
			published:{between:[lowerDate,upperDate]}
		},limit:1}).then(function(entry) {
			//first - did we get any?			
			if(!entry) {
				res.redirect('/');	
			}
			res.render('entry', {entry:entry});
		});
	});
};
