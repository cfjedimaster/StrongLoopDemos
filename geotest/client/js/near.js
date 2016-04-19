$(document).ready(function() {
	
	$status = $('#status');
	
	console.log('Begin trying to get position');
	navigator.geolocation.getCurrentPosition(function(pos) {

		$.get('/api/Cats/?filter[where][location][near]='+pos.coords.latitude+','+pos.coords.longitude+'&filter[where][location][maxDistance]=20', function(res) {
			
			if(res.length === 0) {
				$status.html('Sorry, but no cats are by you. I has a sad. Here, have this cat.<br/><img src=\'/img/sadcat.png\'>');
				return;
			}
			var result = 'I found these cats:<ul>';
			res.forEach(function(cat) {
				result += '<li>'+cat.name+'</li>';
			});
			result += '</ul>';
			$status.html(result);

		});

	}, function(err) {
		$status.html('I\'m sorry, but I was unable to get your location. Blame Apple.');
	});
});