
window.onload = function () {

	var maxSize = '512';

	if(!localStorage.token){
		document.getElementById('tokenContainer').style.display = 'flex'
		document.getElementById("tokenSubmit").addEventListener("click", function(){
			getInfo(document.getElementById("token").value)
		});
	}else{
		getInfo(localStorage.token);
	}

	function prepareDropzone(){

		var previewNode = document.querySelector("#template");
		previewNode.id = "";
		var previewTemplate = previewNode.parentNode.innerHTML;
		previewNode.parentNode.removeChild(previewNode);

		var dropzone = new Dropzone('div#dropzone', { 
			url: '/api/upload',
			paramName: 'file',
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
    			this.on("addedfile", function(file) { 
    				document.getElementById('uploads').style.display = 'block';
    			});
  			}
		});

		// Update the total progress bar
		dropzone.on("uploadprogress", function(file, progress) {
			file.previewElement.querySelector(".progress").style.width = progress + "%";
		});

		dropzone.on("success", function(file, response) {
			// Handle the responseText here. For example, add the text to the preview element:
			a = document.createElement('a');
			a.href = response.url;
			a.target = '_blank';
			a.innerHTML = response.url;

			file.previewTemplate.querySelector(".progress").style.display = 'none';
			file.previewTemplate.querySelector(".link").appendChild(a);
		});

	}
	
	function getInfo(token) {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function() {
			if (xhr.readyState == XMLHttpRequest.DONE) {
				if(xhr.responseText !== 'not-authorized'){
					
					div = document.createElement('div');
					div.id = 'dropzone';
					div.innerHTML = 'Click here or drag and drop files';
					div.style.display = 'flex';

					document.getElementById('btnGithub').style.display = 'none';
					document.getElementById('tokenContainer').style.display = 'none';
					document.getElementById('uploadContainer').appendChild(div);

					if(xhr.responseText.maxFileSize) maxSize = xhr.responseText.maxFileSize;
					if(token) localStorage.token = token;
					prepareDropzone();
				}
			}
		}
		xhr.open('GET', '/api/info', true);
		xhr.setRequestHeader('auth', token);
		xhr.send(null);
	}
};