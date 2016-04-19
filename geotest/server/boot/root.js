var loopback = require('loopback');

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  
  router.get('/test', function(req, res) {

	 server.models.Cat.find({where: {location: {maxDistance:2, near: {lat: 30.22996, lng: -92.05052}}}}, console.log);
	 
	 res.send('done'); 
  });
  
  
  server.use(router);
};
