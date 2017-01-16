window.onload = function () {

	if(!localStorage.admintoken){
		askForToken();
		return;
	}

	var dashboard = document.getElementById('dashboard');
	var page = document.getElementById('page');

	dashboard.style.display = 'block';
	prepareMenu();

	function askForToken(){
		document.getElementById('tokenSubmit').addEventListener('click', function(){
			checkToken();
		});

		function checkToken(){
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function() {
				if (xhr.readyState == XMLHttpRequest.DONE) {
					// xhr.responseText
				}
			}
			xhr.open('POST', '/api/info', true);
			xhr.send(null);
		}
	}

	function prepareMenu(){
		document.getElementById('itemUploads').addEventListener('click', function(){
			getUploads();
		});

		document.getElementById('itemManageGallery').addEventListener('click', function(){
			getGalleries();
		});
	}

	function getUploads(){
		page.innerHTML = '';
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if(xhr.readyState == XMLHttpRequest.DONE){
				if(xhr.responseText !== 'not-authorized'){
					var json = JSON.parse(xhr.responseText);

					var container = document.createElement('div');
					container.innerHTML = `
						<table class="table">
					  		<thead>
					    		<tr>
								      <th>File</th>
								      <th>Gallery</th>
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
						      	<th>${item.gallery}</th>
						      	<td>${item.date}</td>
						    </tr>
						    `;

						table.appendChild(tr);
					}
				}
			}
		}
		xhr.open('GET', '/api/uploads', true);
		xhr.setRequestHeader('auth', localStorage.token);
		xhr.send(null);
	}

	function getContent(item, value){
		let endpoint;
		if(item === 'uploads') endpoint = '/api/uploads'
		if(item === 'galleries') endpoint = '/api/uploads'

	}

}
