$(document).ready(function() {
	$.get("/api/Cats", function(res) {
		console.log(res);
		//generate the map with the results
		var mapurl = 'https://maps.googleapis.com/maps/api/staticmap?';
		mapurl += '&size=700x700&markers=color:red'
		res.forEach(function(cat) {
			console.dir(cat.location);
			mapurl += '%7C'+cat.location.lat+','+cat.location.lng;
		});
		
		$('#map').attr('src',mapurl);
		console.log(mapurl);
	});
});