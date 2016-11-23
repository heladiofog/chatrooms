// server file:
var http = require('http'); //HTTP and client functionality
var fs = require ('fs');    //Filesystem-related functionality
var path = require('path');        //Filesystem path funcionality
var mime = require('mime'); //ability to derive a MIME type based on a filename extension
var cache = {};             //cache object where chached files will be stored
var chatServer = require('./lib/chat_server');  //custom Node module that suplies logic to handle the Socket.IO 

// Starts the Socket.IO server functionality
chatServer.listen(server);

var server = http.createServer(function(request, response) {
    var filePath = false;
    
    if (request.url == '/') {   // default request
        filePath = 'public/index.html';
    } else {                    // relative path
        filePath = 'public' + request.url;
    }
    // Serves the static file
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

/* Helpers */
// When a file requested does not exist
function send404(response) {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: resource not found.');
    response.end();
}

// When a file is requested, first writes the headers and then sends the contents os a file
function sendFile(response, filePath, fileContents) {
    response.writeHead(200, { 'content-type': mime.lookup(path.basename(filePath)) });
    response.end(fileContents);
}

// Determines if a files is cached or not and then serves it
function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {   // If the file is in memory
        sendFile(response, absPath, cache[absPath]);    // then serves the file from memory
    } else {                // If it is not 
        fs.exists(absPath, function(exist) { // Checks if the file exists 
            if (exist) {    // If it does...
                fs.readFile(absPath, function(err, data) {  // Tries to read it...
                    if (err) {  // If there was any error
                        send404(response);
                    } else {    // If there was not any
                        cache[absPath] = data;  // First caches the file
                        sendFile(response, absPath, data); // Then serves it from disk
                    }
                });
            } else {    // If it does not exists...
                send404(response);  // Sends HTTP 404 response
            }
        });
    }
}
/* End Helpers */

// Server starting
server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});