var upload = {};

upload.isPrivate = true;
upload.token = localStorage.token;
upload.maxFileSize;

upload.checkIfPublic = function(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.readyState == XMLHttpRequest.DONE) {
			upload.isPublic = JSON.parse(xhr.responseText).private;
			upload.maxFileSize = JSON.parse(xhr.responseText).maxFileSize;
			upload.preparePage();
		}
	}
	xhr.open('GET', '/api/check', true);
	xhr.send(null);
}

upload.preparePage = function(){
	if(!upload.isPrivate) return upload.prepareUpload();
	if(!upload.token){
		document.getElementById('tokenSubmit').addEventListener('click', function(){
			upload.verifyToken(document.getElementById('token').value)
		});
		document.getElementById('tokenContainer').style.display = 'flex';
		return;
	}
	upload.verifyToken(upload.token, true);
}

upload.verifyToken = function(token, reloadOnError = false){
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
						localStorage.removeItem("token");
						location.reload();
					}
				})

				return;
			}

			localStorage.token = token;
			upload.token = token;
			return upload.prepareUpload();

		}
	}
	xhr.open('GET', '/api/token/verify', true);
	xhr.setRequestHeader('type', 'client');
	xhr.setRequestHeader('token', token);
	xhr.send(null);
}

upload.prepareUpload = function(){

	div = document.createElement('div');
	div.id = 'dropzone';
	div.innerHTML = 'Click here or drag and drop files';
	div.style.display = 'flex';

	document.getElementById('maxFileSize').innerHTML = 'Maximum upload size per file is ' + upload.maxFileSize;
	document.getElementById('tokenContainer').style.display = 'none';
	document.getElementById('uploadContainer').appendChild(div);

	upload.prepareDropzone();

}

upload.prepareDropzone = function(){

	var previewNode = document.querySelector('#template');
	previewNode.id = '';
	var previewTemplate = previewNode.parentNode.innerHTML;
	previewNode.parentNode.removeChild(previewNode);

	var dropzone = new Dropzone('div#dropzone', { 
		url: '/api/upload',
		paramName: 'files[]',
		maxFilesize: upload.maxFileSize.slice(0, -2),
		parallelUploads: 2,
		uploadMultiple: false,
		previewsContainer: 'div#uploads',
		previewTemplate: previewTemplate,
		createImageThumbnails: false,
		maxFiles: 1000,
		autoProcessQueue: true,
		headers: {
    		'auth': upload.token
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

window.onload = function () {
	upload.checkIfPublic();
};