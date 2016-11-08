var $postsDiv, $registerButton, $email, $password, $email2, $password2, $password2c, 
	$registerErrorBlock, $loginLink, $logoutLink, $logout, $loginErrorBlock, $loginButton;
var token, userid;

var lastCheck = new Date('1/1/2000');
//how often to check for data
var INTERVAL = 10 * 1000;

$(document).ready(function() {
	$postsDiv = $('#postsDiv');
	$registerButton = $('#registerButton');
	$email = $('#email');
	$password = $('#password');
	$email2 = $('#email2');
	$password2 = $('#password2');
	$password2c = $('#password2c');
	$registerErrorBlock = $('#registerErrorBlock');
	$loginLink = $('#loginLink');
	$logoutLink = $('#logoutLink');
	$logout = $('#logout');
	$loginErrorBlock = $('#loginErrorBlock');
	$loginButton = $('#loginButton');

	$loginButton.on('click', doLogin);
	$registerButton.on('click', doRegister);
	loadPosts();
});

function loadPosts() {

	// sample url http://localhost:3000/api/posts?filter[include][creator]&filter[where][created][gte]=2016-11-08

	var apiUrl = '/api/posts/?filter[include][creator]&filter[where][created][gte]='+encodeURIComponent(
		lastCheck.toISOString()) + '&filter[order]=created%20desc';

	$.get(apiUrl).then(function(res) {
		console.log('Got '+res.length+' results.');
		var html = '';
		res.forEach(function(p) {
			var card = `
<div class="card">
  <div class="card-block">
    <h4 class="card-title">${p.creator.email} on ${niceDate(p.created)}</h4>
    <p class="card-text">${p.text}</p>
  </div>
</div>
			`;
			html += card;
			//console.dir(p);
		});
		$postsDiv.prepend(html);
		lastCheck = new Date();
		window.setTimeout(loadPosts, INTERVAL);

	});

}

function pad(x) {
	if(x.toString().length === 1) return '0'+x;
	return x;
}

function niceDate(dRaw) {
	var d = new Date(dRaw);
	return d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+' at '+(d.getHours()+1) +':' + pad(d.getMinutes());
}

function doRegister(e) {
	e.preventDefault();
	console.log('doRegister');
	var errors = '';
	if($email2.val() === '') errors += 'Email is required.<br/>';
	if($password2.val() === '') errors += 'Password is required.<br/>';
	if($password2c.val() != $password2.val()) errors += 'Confirmation password didn`t match.<br/>';
	if(errors != '') {
		$registerErrorBlock.html(`
		<div class="alert alert-danger" role="alert">
		<strong>Please correct these errors:</strong><br/>${errors}
		</div>`);
	} else {
		$registerErrorBlock.html('<em>Stand by - trying to register...');
		var user = { email:$email2.val(), password:$password2.val()};
		$.post('/api/appusers', user).then(function(res) {
			//success, now immediately followup with a login
			userid = res.id;
			$.post('/api/appusers/login', user).then(function(res) {
				console.log(res);
				token = res.id;
				$('#login').modal('hide');
				$loginLink.hide();
				$logoutLink.show();
			});
		}).catch(function(e) {
			console.log('catch block');
			var error = e.responseJSON.error.message;
			console.log(error);
			// for now, assume only error is dupe
			$registerErrorBlock.html(`
			<div class="alert alert-danger" role="alert">
			<strong>Please correct these errors:</strong><br/>Sorry, but that email already exists.
			</div>`);

		});
	}
}

function doLogin(e) {
	e.preventDefault();
	console.log('doLogin');
	var errors = '';
	if($email.val() === '') errors += 'Email is required.<br/>';
	if($password.val() === '') errors += 'Password is required.<br/>';
	if(errors != '') {
		$loginErrorBlock.html(`
		<div class="alert alert-danger" role="alert">
		<strong>Please correct these errors:</strong><br/>${errors}
		</div>`);
	} else {
		$loginErrorBlock.html('<em>Stand by - trying to register...');
		var user = { email:$email.val(), password:$password.val()};
		$.post('/api/appusers/login', user).then(function(res) {
			token = res.id;
			userid = res.userId;
			$('#login').modal('hide');
			$loginLink.hide();
			$logoutLink.show();
		}).catch(function(e) {
			var error = e.responseJSON.error.message;
			console.log(error);
			// for now, assume only error is bad login
			$loginErrorBlock.html(`
			<div class="alert alert-danger" role="alert">
			<strong>Please correct these errors:</strong><br/>Your login did not work.
			</div>`);

		});
	}
}

function logout(e) {
	e.preventDefault();
	$.post("/api/appusers/logout").then(function() {
		userid = '';
		token = '';
		$logoutLink.hide();
		$loginLink.show();
	});
}

function doMessage(str) {

	var msg = {text:str};
	$.ajax({
		type:'post',
		url:'/api/posts',
		headers:{
			'Authorization':token
		},
		data:msg
	}).then(function(res) {
		console.log(res);
	}).catch(function(e) {
		console.log('error');
		console.log(e);
	});

}