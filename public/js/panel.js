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
				alert(json.description);
				if(reloadOnError){
					localStorage.removeItem("admintoken");
					location.reload();
				}
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
		panel.getGalleries();
	});
}

panel.getUploads = function(){
	page.innerHTML = '';
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if(xhr.readyState == XMLHttpRequest.DONE){
			
			if(xhr.responseText === 'not-authorized')
				return notAuthorized();

			var json = JSON.parse(xhr.responseText);

			var container = document.createElement('div');
			container.innerHTML = `
				<table class="table">
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
			page.appendChild(container);

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
	xhr.setRequestHeader('auth', panel.token);
	xhr.send(null);
}

panel.getGalleries = function(){
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			
			var json = JSON.parse(xhr.responseText);
			if(json.success === false)
				return alert(json.description);



			localStorage.admintoken = token;
			panel.token = token;
			return panel.prepareDashboard();

		}
	}
	xhr.open('GET', '/api/galleries', true);
	xhr.setRequestHeader('auth', panel.token);
	xhr.send(null);
}

window.onload = function () {
	panel.preparePage();
}
