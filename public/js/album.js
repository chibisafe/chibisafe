let album = {}

album.generateZip = function(identifier) {
	axios.get('/api/album/generateZip/' + identifier)
	.then(function (response) {
		// Construct the a element
		console.log(response.data)
		var link = document.createElement("a");
		link.download = response.data.fileName;
		link.target = "_blank";

		// Construct the uri
		link.href = response.data.zipPath;
		document.body.appendChild(link);
		link.click();

		// Cleanup the DOM
		document.body.removeChild(link);
		delete link;
		return
	})
	.catch(function (error) {
		console.log(error);
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
	});
}
