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
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			
			var json = JSON.parse(xhr.responseText);
			if(json.success === false){

				swal({
					title: "An error ocurred", 
					text: json.description, 
					type: "error"
				}, function(){
					if(reloadOnError){
						localStorage.removeItem("admintoken");
						location.reload();
					}
				})
				
				return;
			}

			localStorage.admintoken = token;
			panel.token = token;
			return panel.prepareDashboard();

		}
	}
	xhr.open('GET', '/api/token/verify', true);
	xhr.setRequestHeader('type', 'admin');
	xhr.setRequestHeader('token', token);
	xhr.send(null);
}

panel.prepareDashboard = function(){
	panel.page = document.getElementById('page');
	document.getElementById('auth').style.display = 'none';
	document.getElementById('dashboard').style.display = 'block';

	document.getElementById('itemUploads').addEventListener('click', function(){
		panel.getUploads();
	});

	document.getElementById('itemManageGallery').addEventListener('click', function(){
		panel.getAlbums();
	});

	panel.getAlbumsSidebar();
}

panel.getUploads = function(album = undefined){
	panel.page.innerHTML = '';
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(xhr.readyState == XMLHttpRequest.DONE){
			
			if(xhr.responseText === 'not-authorized')
				return panel.verifyToken(panel.token);

			var json = JSON.parse(xhr.responseText);
			console.log(json);
			if(json.success === false)
				return swal("An error ocurred", json.description, "error");
			
			var container = document.createElement('div');
			container.innerHTML = `
				<table class="table is-striped is-narrow">
			  		<thead>
			    		<tr>
						      <th>File</th>
						      <th>Album</th>
						      <th>Date</th>
			    		</tr>
			  		</thead>
			  		<tbody id="table">
			  		</tbody>
			  	</table>`;
			panel.page.appendChild(container);

			var table = document.getElementById('table');

			for(var item of json){

				var tr = document.createElement('tr');
				tr.innerHTML = `
					<tr>
				    	<th><a href="${item.file}" target="_blank">${item.file}</a></th>
				      	<th>${item.album}</th>
				      	<td>${item.date}</td>
				    </tr>
				    `;

				table.appendChild(tr);
			}
			
		}
	}
	xhr.open('GET', '/api/uploads', true);
	if(album !== undefined)
		xhr.setRequestHeader('albumid', album);
	xhr.setRequestHeader('auth', panel.token);
	xhr.send(null);
}

panel.getAlbums = function(){
	panel.page.innerHTML = '';
	var xhr = new XMLHttpRequest();

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
	    		</tr>
	  		</thead>
	  		<tbody id="table">
	  		</tbody>
	  	</table>`;

	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			
			if(xhr.responseText === 'not-authorized')
				return panel.verifyToken(panel.token);

			var json = JSON.parse(xhr.responseText);
			console.log(json);
			if(json.success === false)
				return swal("An error ocurred", json.description, "error");

			panel.page.appendChild(container);
			var table = document.getElementById('table');

			for(var item of json.albums){

				var tr = document.createElement('tr');
				tr.innerHTML = `
					<tr>
				    	<th>${item.name}</th>
				      	<th>${item.files}</th>
				      	<td>${item.date}</td>
				    </tr>
				    `;

				table.appendChild(tr);
			}

			document.getElementById('submitAlbum').addEventListener('click', function(){
				panel.submitAlbum();
			});
			
		}
	}

	xhr.open('GET', '/api/albums', true);
	xhr.setRequestHeader('auth', panel.token);
	xhr.setRequestHeader('extended', '');
	xhr.send(null);
}

panel.submitAlbum = function(){
	
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			
			if(xhr.responseText === 'not-authorized')
				return panel.verifyToken(panel.token);

			var json = JSON.parse(xhr.responseText);
			if(json.success === false)
				return swal("An error ocurred", json.description, "error");

			swal("Woohoo!", "Album was added successfully", "success");
			panel.getAlbumsSidebar();
			panel.getAlbums();
			return;
		}
	}

	xhr.open('POST', '/api/albums', true);
	xhr.setRequestHeader('auth', panel.token);
	xhr.setRequestHeader('name', document.getElementById('albumName').value);
	xhr.send(null);

}

panel.getAlbumsSidebar = function(){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			
			if(xhr.responseText === 'not-authorized')
				return panel.verifyToken(panel.token);

			var json = JSON.parse(xhr.responseText);
			if(json.success === false)
				return swal("An error ocurred", json.description, "error");

			var albumsContainer = document.getElementById('albumsContainer');
			albumsContainer.innerHTML = '';

			if(json.albums === undefined) return;

			for(var album of json.albums){

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
		}
	}

	xhr.open('GET', '/api/albums', true);
	xhr.setRequestHeader('auth', panel.token);
	xhr.send(null);
}

panel.getAlbum = function(item){
	panel.getUploads(item.id);
}

window.onload = function () {
	panel.preparePage();
}
