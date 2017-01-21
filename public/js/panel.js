let panel = {}

panel.page;
panel.token = localStorage.admintoken;

panel.preparePage = function(){
	if(!panel.token){
		document.getElementById('auth').style.display = 'flex';
		document.getElementById('tokenSubmit').addEventListener('click', function(){
			panel.verifyToken(document.getElementById('token').value);
		});
		return;
	}
	panel.verifyToken(panel.token, true);
}

panel.verifyToken = function(token, reloadOnError = false){
	
	axios.post('/api/tokens/verify', {
		type: 'admin',
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
					localStorage.removeItem("admintoken");
					location.reload();
				}
			})
			return;
		}

		axios.defaults.headers.common['auth'] = token;
		localStorage.admintoken = token;
		panel.token = token;
		return panel.prepareDashboard();

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

}

panel.prepareDashboard = function(){
	panel.page = document.getElementById('page');
	document.getElementById('auth').style.display = 'none';
	document.getElementById('dashboard').style.display = 'block';

	/*
	document.getElementById('itemUploads').addEventListener('click', function(){
		panel.getUploads();
	});

	document.getElementById('itemManageGallery').addEventListener('click', function(){
		panel.getAlbums();
	});

	document.getElementById('itemTokens').addEventListener('click', function(){
		panel.changeTokens();
	});
	*/

	panel.getAlbumsSidebar();
}

panel.logout = function(){
	localStorage.removeItem("admintoken");
	location.reload('/');
}

panel.getUploads = function(album = undefined, page = undefined){

	if(page === undefined) page = 0;

	let url = '/api/uploads/' + page
	if(album !== undefined)
		url = '/api/album/' + album + '/' + page

	axios.get(url)
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}
		

		var prevPage = 0;
		var nextPage = page + 1;

		if(response.data.files.length < 25)
			nextPage = page;
		
		if(page > 0) prevPage = page - 1;

		panel.page.innerHTML = '';
		var container = document.createElement('div');
		container.innerHTML = `
			<div class='columns'>
				<div class="column">
					<nav class="pagination is-centered">
				  		<a class="pagination-previous" onclick="panel.getUploads(${album}, ${prevPage} )">Previous</a>
				  		<a class="pagination-next" onclick="panel.getUploads(${album}, ${nextPage} )">Next page</a>
					</nav>
				</div>
			</div>

			<table class="table is-striped is-narrow">
				<thead>
					<tr>
						  <th>File</th>
						  <th>Album</th>
						  <th>Date</th>
						  <th></th>
					</tr>
				</thead>
				<tbody id="table">
				</tbody>
			</table>

			<div class='columns'>
				<div class="column">
					<nav class="pagination is-centered">
				  		<a class="pagination-previous" onclick="panel.getUploads(${album}, ${prevPage} )">Previous</a>
				  		<a class="pagination-next" onclick="panel.getUploads(${album}, ${nextPage} )">Next page</a>
					</nav>
				</div>
			</div>
			`;
		panel.page.appendChild(container);

		var table = document.getElementById('table');

		for(var item of response.data.files){

			var tr = document.createElement('tr');
			tr.innerHTML = `
				<tr>
					<th><a href="${item.file}" target="_blank">${item.file}</a></th>
					<th>${item.album}</th>
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

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

}

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
					if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
					else return swal("An error ocurred", response.data.description, "error");		
				}

				swal("Deleted!", "The file has been deleted.", "success");
				panel.getUploads();
				return;

			})
			.catch(function (error) {
				return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
				console.log(error);
			});

		}
	);
}

panel.getAlbums = function(){

	axios.get('/api/albums')
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
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

}

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
    		return false
  		}
  		
  		axios.post('/api/albums/rename', {
			id: id,
			name: inputValue
		})
		.then(function (response) {

			if(response.data.success === false){
				if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
				else if(response.data.description === 'Name already in use') swal.showInputError("That name is already in use!");
				else swal("An error ocurred", response.data.description, "error");
				return;
			}

			swal("Success!", "Your album was renamed to: " + inputValue, "success");
			panel.getAlbumsSidebar();
			panel.getAlbums();
			return;

		})
		.catch(function (error) {
			return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
			console.log(error);
		});
		
	});

}

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
					if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
					else return swal("An error ocurred", response.data.description, "error");		
				}

				swal("Deleted!", "Your album has been deleted.", "success");
				panel.getAlbumsSidebar();
				panel.getAlbums();
				return;

			})
			.catch(function (error) {
				return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
				console.log(error);
			});

		}
	);

}

panel.submitAlbum = function(){
	
	axios.post('/api/albums', {
		name: document.getElementById('albumName').value
	})
	.then(function (response) {

		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		swal("Woohoo!", "Album was added successfully", "success");
		panel.getAlbumsSidebar();
		panel.getAlbums();
		return;

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

}

panel.getAlbumsSidebar = function(){

	axios.get('/api/albums/sidebar')
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
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

}

panel.getAlbum = function(item){
	panel.getUploads(item.id);
}

panel.changeTokens = function(){

	axios.get('/api/tokens')
	.then(function (response) {
		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		panel.page.innerHTML = '';
		var container = document.createElement('div');
		container.className = "container";
		container.innerHTML = `
			<h2 class="subtitle">Manage your tokens</h2>

			<label class="label">Client token:</label>
			<p class="control has-addons">
				<input id="clientToken" class="input is-expanded" type="text" placeholder="Your client token">
				<a id="submitClientToken" class="button is-primary">Save</a>
			</p>

			<label class="label">Admin token:</label>
			<p class="control has-addons">
				<input id="adminToken" class="input is-expanded" type="text" placeholder="Your admin token">
				<a id="submitAdminToken" class="button is-primary">Save</a>
			</p>
		`;

		panel.page.appendChild(container);

		document.getElementById('clientToken').value = response.data.clientToken;
		document.getElementById('adminToken').value = response.data.adminToken;

		document.getElementById('submitClientToken').addEventListener('click', function(){
			panel.submitToken('client', document.getElementById('clientToken').value);
		});

		document.getElementById('submitAdminToken').addEventListener('click', function(){
			panel.submitToken('admin', document.getElementById('adminToken').value);
		});


	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

}

panel.submitToken = function(type, token){

	axios.post('/api/tokens/change', {
		type: type,
		token: token
	})
	.then(function (response) {

		if(response.data.success === false){
			if(response.data.description === 'not-authorized') return panel.verifyToken(panel.token);
			else return swal("An error ocurred", response.data.description, "error");		
		}

		swal({
			title: "Woohoo!", 
			text: 'Your token was changed successfully.', 
			type: "success"
		}, function(){
			
			if(type === 'client')
				localStorage.token = token;
			else if(type === 'admin')
				localStorage.admintoken = token

			location.reload();
				
		})

	})
	.catch(function (error) {
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
		console.log(error);
	});

}

window.onload = function () {
	panel.preparePage();
}
