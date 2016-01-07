
var chalk = require('chalk');

console.log(chalk.magenta('Lets seed this app!'));

/*
This script is based on: 
https://github.com/strongloop-training/coffee-time/blob/master/server/boot/create-sample-model-data.js
*/

module.exports = function(app) {

	//sample data
	var data = [
		{
			title:'Content One', 
			body:'Body One',
			posted:new Date()
		},
		{
			title:'Content Two', 
			body:"Body Two",
			posted:new Date()
		},
		{
			title:'Content Three', 
			body:'Body Three',
			posted:new Date()
		}
	];
	
	app.models.TestContent.create(data, function(err, records) {
		if (err) { return console.log(chalk.red(err.message)); }
		console.log(chalk.magenta('Done seeding data, '+records.length+' records created.'));
	});
	

}