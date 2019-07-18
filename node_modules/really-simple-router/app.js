//import modules
const http = require("http");
const handles = require("./handle.js");

//print to console
process.stdout.write("Server booting up\n");

//creat the server on port 8080
const server = http.createServer(handles.serverHandle);
server.listen(8080);

module.exports = {};
