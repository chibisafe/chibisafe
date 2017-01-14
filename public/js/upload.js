var maxSize = '512';

var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
	if (xhr.readyState == XMLHttpRequest.DONE) {
		if(xhr.responseText !== 'not-authorized'){
			document.getElementById('btnGithub').style.display = 'none';
			document.getElementById('dropzone').style.display = 'flex';
		}
		if(xhr.responseText.maxFileSize)
			maxSize = xhr.responseText.maxFileSize;
	}
}
xhr.open('GET', '/api/info', true);
xhr.send(null);

window.onload = function () {

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
		autoProcessQueue: true
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
		a.innerHTML = response.filename;

		file.previewTemplate.querySelector(".progress").style.display = 'none';
		file.previewTemplate.querySelector(".link").appendChild(a);
	});

};