var $backBtn, $fwdBtn;
var $results;

var currentPos = 0;
var total;

var perPage = 10;

$(document).ready(function() {
	$backBtn = $("#goBackBtn");
	$fwdBtn = $("#goForwardBtn");
	$results = $("#results");
	
	//step one - how much crap do we have?
	$.get('http://localhost:3000/api/people/count', function(res) {
		total = res.count;
		console.log('count is '+total);
	},'json');

	fetchData();
	
	$backBtn.on('click', moveBack);
	$fwdBtn.on('click', moveForward);
			
});

function fetchData() {

	//first, disable both
	$backBtn.attr('disabled','disabled');
	$fwdBtn.attr('disabled','disabled');

	//hide results currently there
	$results.html('');
	
	//now fetch
	$.get('http://localhost:3000/api/people?filter[limit]='+perPage+'&filter[skip]='+currentPos, function(res) {
		renderData(res);
		
		if(currentPos > 0) $backBtn.removeAttr('disabled');
		if(currentPos + perPage < total) $fwdBtn.removeAttr('disabled');
	},'json');
			
}

//could(should) use a nice template lang
function renderData(p) {
	s = '';
	p.forEach(function(person) {
		s += '<div class="person"><img src="' + person.picture + '" width="48" height="48">'+person.name+'</div>';
	});
	$results.html(s);
}

function moveBack() {
	currentPos -= perPage;
	fetchData();	
}

function moveForward() {
	currentPos += perPage;
	fetchData();	
}

