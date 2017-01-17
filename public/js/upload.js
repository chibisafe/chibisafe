
window.onload = function () {

	var USINGTOKEN;
	var maxSize = '512';

	// First check to see if the service is using token or not
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			USINGTOKEN = JSON.parse(xhr.responseText).private;
			prepareTokenThing();
		}
	}
	xhr.open('GET', '/api/check', true);
	xhr.send(null);

	function prepareTokenThing(){

		if(!USINGTOKEN) return getInfo();

		if(!localStorage.token){
			document.getElementById('tokenSubmit').addEventListener('click', function(){
				getInfo(document.getElementById('token').value)
			});
			return document.getElementById('tokenContainer').style.display = 'flex';
		}

		getInfo(localStorage.token);

	}

	function prepareDropzone(){

		var previewNode = document.querySelector('#template');
		previewNode.id = '';
		var previewTemplate = previewNode.parentNode.innerHTML;
		previewNode.parentNode.removeChild(previewNode);

		var dropzone = new Dropzone('div#dropzone', { 
			url: '/api/upload',
			paramName: 'files[]',
			maxFilesize: maxSize,
			parallelUploads: 2,
			uploadMultiple: false,
			previewsContainer: 'div#uploads',
			previewTemplate: previewTemplate,
			createImageThumbnails: false,
			maxFiles: 1000,
			autoProcessQueue: true,
			headers: {
        		'auth': localStorage.token
    		},
    		init: function() {
    			this.on('addedfile', function(file) { 
    				document.getElementById('uploads').style.display = 'block';
    			});
  			}
		});

		// Update the total progress bar
		dropzone.on('uploadprogress', function(file, progress) {
			file.previewElement.querySelector('.progress').style.width = progress + '%';
		});

		dropzone.on('success', function(file, response) {

			// Handle the responseText here. For example, add the text to the preview element:

			if(response.success === false){
				var span = document.createElement('span');
				span.innerHTML = response.description;
				file.previewTemplate.querySelector('.link').appendChild(span);
				return;
			}

			a = document.createElement('a');
			a.href = response.files[0].url;
			a.target = '_blank';
			a.innerHTML = response.files[0].url;
			file.previewTemplate.querySelector('.link').appendChild(a);
			
			file.previewTemplate.querySelector('.progress').style.display = 'none';
			
		});

	}
	
	function getInfo(token) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				
				if(xhr.responseText === 'not-authorized')
					return notAuthorized();

				div = document.createElement('div');
				div.id = 'dropzone';
				div.innerHTML = 'Click here or drag and drop files';
				div.style.display = 'flex';

				document.getElementById('btnGithub').style.display = 'none';
				document.getElementById('tokenContainer').style.display = 'none';
				document.getElementById('uploadContainer').appendChild(div);
				document.getElementById('panel').style.display = 'block';
				
				if(xhr.responseText.maxFileSize) maxSize = JSON.parse(xhr.responseText).maxFileSize;
				if(token) localStorage.token = token;

				prepareDropzone();
				
			}
		}
		xhr.open('GET', '/api/info', true);

		if(token !== undefined)
			xhr.setRequestHeader('auth', token);

		xhr.send(null);
	}

	function notAuthorized() {
		localStorage.removeItem("token");
		location.reload();
	}
};