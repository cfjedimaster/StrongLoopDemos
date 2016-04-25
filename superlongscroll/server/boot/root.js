module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());

  //crappy temp way to copy in a bunch of data
  var ucaseFirst = function(s) {
    return s.substring(0,1).toUpperCase() + s.substring(1);  
  };
  
  /*
  router.get('/temp', function(req, res) {
    
    console.dir(server.models.person);
    
    var usersRaw = require('../users.json').results;
    var users = [];
    console.log('going to insert '+usersRaw.length+' users');
    
    for(var i=0;i<Math.min(5000,usersRaw.length);i++) {
      var newUser = {name:ucaseFirst(usersRaw[i].user.name.first) + ' ' +  ucaseFirst(usersRaw[i].user.name.last), picture:usersRaw[i].user.picture.thumbnail};
      //console.dir(newUser);
      server.models.person.create(newUser,function() {
        console.dir(arguments);
      });
    }
    res.send('doing it');
  });
  */
  
  server.use(router);
};
