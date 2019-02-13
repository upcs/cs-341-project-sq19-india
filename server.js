var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
	if(req.url === '/index.html'){
		fs.readFile('index.html', function(err, data) {
    		res.writeHead(200, {'Content-Type': 'text/html'});
    		res.write(data);
    		console.log("sent html to client");	
    		res.end();
  		});
	}
	else if(req.url === '/style.css'){
		fs.readFile('style.css', function(err, data) {
			res.write(data);
			console.log("sent css to client");
			res.end();
		});
	}
}).listen(8080);

console.log("server running on port 8080");
