let panel = {};

panel.page;
panel.username;
panel.token = localStorage.token;
panel.filesView = localStorage.filesView;

panel.preparePage = function(){
	if(!panel.token) return window.location = '/auth';
	panel.verifyToken(panel.token, true);
};

panel.verifyToken = function(token, reloadOnError){
	if(reloadOnError === undefined)
		reloadOnError = false;

	axios.post('/api/tokens/verify', {
		token: token
	})
	.then(function (response) {

		if(response.data.success === false){
			swal({
				title: "An error ocurred", 
				text: response.data.description, 
				type: "error"
			}, function(){
				if(reloadOnError){
					localStorage.removeItem("token");
					location.location = '/auth';
				}
			});
			return;
		}

		axios.defaults.headers.common['token'] = token;
		localStorage.token = token;
		panel.token = token;
		panel.username = response.data.username;
		return panel.prepareDashboard();

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.prepareDashboard = function(){
	panel.page = document.getElementById('page');
	document.getElementById('auth').style.display = 'none';
	document.getElementById('dashboard').style.display = 'block';

	document.getElementById('itemUploads').addEventListener('click', function(){
		panel.setActiveMenu(this);
	});

	document.getElementById('itemManageGallery').addEventListener('click', function(){
		panel.setActiveMenu(this);
	});

	document.getElementById('itemTokens').addEventListener('click', function(){
		panel.setActiveMenu(this);
	});

	document.getElementById('itemPassword').addEventListener('click', function(){
		panel.setActiveMenu(this);
	});

	document.getElementById('itemLogout').innerHTML = `Logout ( ${panel.username} )`;

	panel.getAlbumsSidebar();
};

panel.logout = function(){
	localStorage.removeItem("token");
	location.reload('/');
};

panel.getUploads = function(album = undefined, page = undefined){

	if(page === undefined) page = 0;

	let url = '/api/uploads/' + page;
	if(album !== undefined)
		url = '/api/album/' + album + '/' + page;

	axios.get(url).then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}
		
		var prevPage = 0;
		var nextPage = page + 1;

		if(response.data.files.length < 25)
			nextPage = page;
		
		if(page > 0) prevPage = page - 1;

		panel.page.innerHTML = '';
		var container = document.createElement('div');
		var pagination = `<nav class="pagination is-centered">
					  		<a class="pagination-previous" onclick="panel.getUploads(${album}, ${prevPage} )">Previous</a>
					  		<a class="pagination-next" onclick="panel.getUploads(${album}, ${nextPage} )">Next page</a>
						</nav>`;
		var listType = `
		<div class="columns">
			<div class="column">
				<a class="button is-small is-outlined is-danger" title="List view" onclick="panel.setFilesView('list', ${album}, ${page})">
					<span class="icon is-small">
						<i class="fa fa-list-ul"></i>
					</span>
				</a>
				<a class="button is-small is-outlined is-danger" title="List view" onclick="panel.setFilesView('thumbs', ${album}, ${page})">
					<span class="icon is-small">
						<i class="fa fa-th-large"></i>
					</span>
				</a>
			</div>
		</div>`;

		if(panel.filesView === 'thumbs'){

			container.innerHTML = `
				${pagination}
				<hr>
				${listType}
				<div class="columns is-multiline is-mobile" id="table">

				</div>
				${pagination}
			`;

			panel.page.appendChild(container);
			var table = document.getElementById('table');

			for(var item of response.data.files){

				var div = document.createElement('div');
				div.className = "column is-2";
				if(item.thumb !== undefined)
					div.innerHTML = `<a href="${item.file}" target="_blank"><img src="${item.thumb}"/></a><a class="button is-small is-danger is-outlined" title="Delete file" onclick="panel.deleteFile(${item.id})"><span class="icon is-small"><i class="fa fa-trash-o"></i></span></a>`;
				else
					div.innerHTML = `<a href="${item.file}" target="_blank"><h1 class="title">.${item.file.split('.').pop()}</h1></a><a class="button is-small is-danger is-outlined" title="Delete file" onclick="panel.deleteFile(${item.id})"><span class="icon is-small"><i class="fa fa-trash-o"></i></span></a>`;
				table.appendChild(div);

			}

		}else{

			var albumOrUser = 'Album';
			if(panel.username === 'root')
				albumOrUser = 'User';

			container.innerHTML = `
				${pagination}
				<hr>
				${listType}
				<table class="table is-striped is-narrow is-left">
					<thead>
						<tr>
							  <th>File</th>
							  <th>${albumOrUser}</th>
							  <th>Date</th>
							  <th></th>
						</tr>
					</thead>
					<tbody id="table">
					</tbody>
				</table>
				<hr>
				${pagination}
			`;

			panel.page.appendChild(container);
			var table = document.getElementById('table');

			for(var item of response.data.files){

				var tr = document.createElement('tr');

				var displayAlbumOrUser = item.album;
				if(panel.username === 'root'){
					displayAlbumOrUser = '';
					if(item.username !== undefined)
						displayAlbumOrUser = item.username;
				}
					
				tr.innerHTML = `
					<tr>
						<th><a href="${item.file}" target="_blank">${item.file}</a></th>
						<th>${displayAlbumOrUser}</th>
						<td>${item.date}</td>
						<td>
							<a class="button is-small is-danger is-outlined" title="Delete album" onclick="panel.deleteFile(${item.id})">
								<span class="icon is-small">
									<i class="fa fa-trash-o"></i>
								</span>
							</a>
						</td>
					</tr>
					`;

				table.appendChild(tr);
			}
		}
	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.setFilesView = function(view, album, page){
	localStorage.filesView = view;
	panel.filesView = view;
	panel.getUploads(album, page);
};

panel.deleteFile = function(id){
	swal({
		title: "Are you sure?",
		text: "You wont be able to recover the file!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ff3860",
		confirmButtonText: "Yes, delete it!",
		closeOnConfirm: false
	},
		function(){

			axios.post('/api/upload/delete', {
				id: id
			})
			.then(function (response) {

				if(response.data.success === false){
					if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
					else return swal("An error ocurred", response.data.description, "error");		
				}

				swal("Deleted!", "The file has been deleted.", "success");
				panel.getUploads();

			})
			.catch(function (error) {
				return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
				console.log(error);
			});

		}
	);
};

panel.getAlbums = function(){

	axios.get('/api/albums').then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		panel.page.innerHTML = '';
		var container = document.createElement('div');
		container.className = "container";
		container.innerHTML = `
			<h2 class="subtitle">Create new album</h2>

			<p class="control has-addons has-addons-centered">
				<input id="albumName" class="input" type="text" placeholder="Name">
				<a id="submitAlbum" class="button is-primary">Submit</a>
			</p>

			<h2 class="subtitle">List of albums</h2>

			<table class="table is-striped is-narrow">
				<thead>
					<tr>
						  <th>Name</th>
						  <th>Files</th>
						  <th>Created At</th>
						  <th>Public link</th>
						  <th></th>
					</tr>
				</thead>
				<tbody id="table">
				</tbody>
			</table>`;

		panel.page.appendChild(container);
		var table = document.getElementById('table');

		for(var item of response.data.albums){

			var tr = document.createElement('tr');
			tr.innerHTML = `
				<tr>
					<th>${item.name}</th>
					<th>${item.files}</th>
					<td>${item.date}</td>
					<td><a href="${item.identifier}" target="_blank">Album link</a></td>
					<td>
						<a class="button is-small is-primary is-outlined" title="Edit name" onclick="panel.renameAlbum(${item.id})">
							<span class="icon is-small">
								<i class="fa fa-pencil"></i>
							</span>
						</a>
						<a class="button is-small is-danger is-outlined" title="Delete album" onclick="panel.deleteAlbum(${item.id})">
							<span class="icon is-small">
								<i class="fa fa-trash-o"></i>
							</span>
						</a>
					</td>
				</tr>
				`;

			table.appendChild(tr);
		}

		document.getElementById('submitAlbum').addEventListener('click', function(){
			panel.submitAlbum();
		});

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.renameAlbum = function(id){
	
	swal({
		title: "Rename album",
		text: "New name you want to give the album:",
		type: "input",
		showCancelButton: true,
		closeOnConfirm: false,
		animation: "slide-from-top",
		inputPlaceholder: "My super album"
	},function(inputValue){
		if (inputValue === false) return false;
		if (inputValue === "") {
			swal.showInputError("You need to write something!");
			return false;
		}
		
		axios.post('/api/albums/rename', {
			id: id,
			name: inputValue
		})
		.then(function (response) {

			if(response.data.success === false){
				if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
				else if(response.data.description === 'Name already in use') swal.showInputError("That name is already in use!");
				else swal("An error ocurred", response.data.description, "error");
				return;
			}

			swal("Success!", "Your album was renamed to: " + inputValue, "success");
			panel.getAlbumsSidebar();
			panel.getAlbums();

		})
		.catch(function (error) {
			return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
			console.log(error);
		});
		
	});

};

panel.deleteAlbum = function(id){
	swal({
		title: "Are you sure?",
		text: "This won't delete your files, only the album!",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#ff3860",
		confirmButtonText: "Yes, delete it!",
		closeOnConfirm: false
	},
		function(){

			axios.post('/api/albums/delete', {
				id: id
			})
			.then(function (response) {

				if(response.data.success === false){
					if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
					else return swal("An error ocurred", response.data.description, "error");		
				}

				swal("Deleted!", "Your album has been deleted.", "success");
				panel.getAlbumsSidebar();
				panel.getAlbums();

			})
			.catch(function (error) {
				return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
				console.log(error);
			});

		}
	);

};

panel.submitAlbum = function(){
	
	axios.post('/api/albums', {
		name: document.getElementById('albumName').value
	})
	.then(function (response) {

		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		swal("Woohoo!", "Album was added successfully", "success");
		panel.getAlbumsSidebar();
		panel.getAlbums();

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.getAlbumsSidebar = function(){

	axios.get('/api/albums/sidebar')
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		var albumsContainer = document.getElementById('albumsContainer');
		albumsContainer.innerHTML = '';

		if(response.data.albums === undefined) return;

		for(var album of response.data.albums){

			li = document.createElement('li');
			a = document.createElement('a');
			a.id = album.id;
			a.innerHTML = album.name;

			a.addEventListener('click', function(){
				panel.getAlbum(this);
			});

			li.appendChild(a);
			albumsContainer.appendChild(li);
		}


	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.getAlbum = function(item){
	panel.setActiveMenu(item);
	panel.getUploads(item.id);
};

panel.changeToken = function(){

	axios.get('/api/tokens')
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		panel.page.innerHTML = '';
		var container = document.createElement('div');
		container.className = "container";
		container.innerHTML = `
			<h2 class="subtitle">Manage your token</h2>

			<label class="label">Your current token:</label>
			<p class="control has-addons">
				<input id="token" readonly class="input is-expanded" type="text" placeholder="Your token" value="${response.data.token}">
				<a id="getNewToken" class="button is-primary">Request new token</a>
			</p>
		`;

		panel.page.appendChild(container);

		document.getElementById('getNewToken').addEventListener('click', function(){
			panel.getNewToken();
		});

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.getNewToken = function(){

	axios.post('/api/tokens/change')
	.then(function (response) {

		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		swal({
			title: "Woohoo!", 
			text: 'Your token was changed successfully.', 
			type: "success"
		}, function(){
			localStorage.token = response.data.token;
			location.reload();
		});

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.changePassword = function(){

	panel.page.innerHTML = '';
	var container = document.createElement('div');
	container.className = "container";
	container.innerHTML = `
		<h2 class="subtitle">Change your password</h2>

		<label class="label">New password:</label>
		<p class="control has-addons">
			<input id="password" class="input is-expanded" type="password" placeholder="Your new password">
		</p>
		<label class="label">Confirm password:</label>
		<p class="control has-addons">
			<input id="passwordConfirm" class="input is-expanded" type="password" placeholder="Verify your new password">
			<a id="sendChangePassword" class="button is-primary">Set new password</a>
		</p>
	`;

	panel.page.appendChild(container);

	document.getElementById('sendChangePassword').addEventListener('click', function(){
		if (document.getElementById('password').value === document.getElementById('passwordConfirm').value) {
			panel.sendNewPassword(document.getElementById('password').value);
		} else {
			swal({
				title: "Password mismatch!", 
				text: 'Your passwords do not match, please try again.', 
				type: "error"
			}, function() {
				panel.changePassword();
			});
		}
	});
};

panel.sendNewPassword = function(pass){

	axios.post('/api/password/change', {password: pass})
	.then(function (response) {

		if(response.data.success === false){
			if(response.data.description === 'No token provided') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		swal({
			title: "Woohoo!", 
			text: 'Your password was changed successfully.', 
			type: "success"
		}, function(){
			location.reload();
		});

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

};

panel.setActiveMenu = function(item){
	var menu = document.getElementById('menu');
	var items = menu.getElementsByTagName('a');
	for(var i = 0; i < items.length; i++)
		items[i].className = "";

	item.className = 'is-active';
};

window.onload = function () {
	panel.preparePage();
};
