var album = {};

album.get = function(album){
	axios.get('/api/album/get/' + album)
  	.then(function (response) {
    	document.getElementById('title').innerHTML = response.data.title;
    	document.getElementById('count').innerHTML = response.data.count + ' files';

    	var container = document.createElement('div');
    	container.innerHTML = `<div class="columns is-multiline is-mobile" id="table"></div>`
    	document.getElementById('container').appendChild(container);
    	
    	var table = document.getElementById('table');
		for(var item of response.data.files){
			var div = document.createElement('div');
			div.className = "column is-2";
			if(item.thumb !== undefined)
				div.innerHTML = `<a href="${item.file}" target="_blank"><img src="${item.thumb}"/></a>`;
			else
				div.innerHTML = `<a href="${item.file}" target="_blank"><h1 class="title">.${item.file.split('.').pop()}</h1></a>`;
			table.appendChild(div);
		}
  	})
  	.catch(function (error) {
  		return swal("An error ocurred", 'There was an error with the request, please check the console for more information.', "error");
    	console.log(error);
  	});
}

window.onload = function () {
	var identifier = document.location.pathname;
	identifier = identifier.substring(3, identifier.length);
	album.get(identifier);
};