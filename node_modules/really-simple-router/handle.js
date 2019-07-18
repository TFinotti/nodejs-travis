const qs = require("querystring");
const url = require("url");

/**
 * this is an example of some simple HTML content that can be rendered as an "index page"
 */
const content =
  "<!DOCTYPE html>" +
  "<html>" +
  "    <head>" +
  '        <meta charset="utf-8" />' +
  "        <title>ECE Paris NodeJS module 1</title>" +
  "    </head>" +
  "    <body>" +
  "         <p>Bonjour World! Welcome to the home page This is a nodejs module being called by app.js</p>" +
  "    </body>" +
  "</html>";

/**
 * this is the routing content
 */
module.exports = {
  serverHandle: function (req, res) {
    //parse the URL for a route name
    const route = url.parse(req.url, true);
    //pathname is the path section of the URL,
    //i.e. comes after the host and before the query
    //including the initial slash if present.
    if (route.pathname === "/hello") {
      //maybe rename route to parsedURL
      //send back 200 OK response
      res.writeHead(200, { "Content-Type": "text/html" });
      //then vary response based on name
      const name = route.query.name;
      //if no "name" query supplied then return a default page
      if (!name) {
        res.write("<h1>No query was supplied<h1>");
        res.end();
      } else if (name === "inci") {
        res.write(
          "<h1>hello my name is inci i am the designer of this server and website<h1>"
        );
        res.end();
      } else {
        res.write(`Hello ${name}`); //write a response
        //end response}
        res.end();
      }
      const queryParams = qs.parse(url.parse(req.url).query);
      console.log(queryParams);

    } else if (route.pathname === "/") {
      //200 OK response
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(content); //write a response
      res.end();

    } else if (route.pathname === "/time") {
      //200 OK response
      res.writeHead(200, { "Content-Type": "text/html" });
      //print time
      res.write(new Date().toString());
      res.end();

    } else {
      //send 404 response
      res.writeHead(404, { "Content-type": "text/html" });
      //message for user
      res.write("<h1>404 not found... So sad :(</h1>");
      res.end();
    }
  }
};
