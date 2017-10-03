let album = {}

album.generateZip = function(identifier) {
	axios.get('/api/album/zip/' + identifier)
	.then(function (response) {
		if (response.data.success) {
			// Construct the a element
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
		}
		else {
			return swal("An error ocurred", response.data.description, "error");
		}
	})
	.catch(function (error) {
		console.log(error);
		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
	});
}
