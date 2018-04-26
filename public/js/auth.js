var page = {};

page.do = function(dest){

	var user = document.getElementById('user').value;
	var pass = document.getElementById('pass').value;

	if(user === undefined || user === null || user === '')
		return swal('Error', 'You need to specify a username', 'error');
	if(pass === undefined || pass === null || pass === '')
		return swal('Error', 'You need to specify a username', 'error');

	axios.post('/api/' + dest, {
		username: user,
		password: pass
	})
	.then(function (response) {

		if(response.data.success === false)
			return swal('Error', response.data.description, 'error');
		
		localStorage.token = response.data.token;
		window.location = '/dashboard';

	})
	.catch(function (error) {
		return swal('An error ocurred', 'There was an error with the request, please check the console for more information.', 'error');
		console.log(error);
	});
};

page.verify = function(){
	page.token = localStorage.token;
	if(page.token === undefined) return;

	axios.post('/api/tokens/verify', {
		token: page.token
	})
	.then(function (response) {

		if(response.data.success === false)
			return swal('Error', response.data.description, 'error');
		
		window.location = '/dashboard';

	})
	.catch(function (error) {
		return swal('An error ocurred', 'There was an error with the request, please check the console for more information.', 'error');
		console.log(error);
	});

};

window.onload = function () {
	page.verify();
};