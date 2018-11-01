const path = require("path");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser"); // simplifies access to request body
const fs = require('fs');  // NEW - this is required
const app = express();  // make express app
const http = require('http').Server(app);  // inject app into the server

// ADD THESE COMMENTS AND IMPLEMENTATION HERE 
// 1 set up the view engine
// 2 manage our entries
// 3 set up the logger
// 4 handle valid GET requests
// 5 handle valid POST request (not required to fully work)
// 6 respond with 404 if a bad URI is requested

// Listen for an application request on port 8081
const port = process.env.PORT || 8081;
http.listen(port, function () {
  console.log('app listening on http://127.0.0.1:8081/');
})
// 1 set up the view engine
app.set("views", path.resolve(__dirname, "views")); // path to views
app.set("view engine", "ejs"); // specify our view

// 2 include public assets and use bodyParser
// Node uses __dirname for the The directory name of the current module.
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 3 log requests to stdout and also
// log HTTP requests to a file using the standard Apache combined format
// see https://github.com/expressjs/morgan for more
var accessLogStream = fs.createWriteStream(__dirname + '/access.log', { flags: 'a' });
app.use(logger('dev'));
app.use(logger('combined', { stream: accessLogStream }));

// 4 http GET default page at /
app.get("/", function (req, res) {
  //res.sendFile(path.join(__dirname + '/assets/index.html'))
  res.render("index.ejs");
})

// 4 http GET /tic-tac-toe
app.get("/tic-tac-toe", function (req, res) {
  res.render("application.ejs");
})

// 4 http GET /about
app.get("/about", function (req, res) {
  res.render("aboutme.ejs");
})

// 4 http GET /contact
app.get("/contact", function (req, res) {
  res.render("contactme.ejs");
})
// 5 http POST /contact
app.post("/contact", function (req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const comment = req.body.message;
  const isError = true;

  var api_key = 'pubkey-5596cf033c3c0052999a246bf2e6f034';
  var domain = 'sandboxc48ba95a4864422d82cfa4b8c666b831.mailgun.org';
  var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

  text = "Name : "+ name+ "\n"
          + "Email : "+ email+ "\n"
          + "Message : "+ comment
  var data = {
    from: 'Mail Gun archerblazek <postmaster@sandboxc48ba95a4864422d82cfa4b8c666b831.mailgun.org>',
    to: 'archerblazek@gmail.com',
    subject: 'Webapps Mail',
    text: text
  };

  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    res.redirect("/contact")
  });

 
  
});
// 6 this will execute for all unknown URIs not specifically handled
app.get(function (req, res) {
  res.render("404")
});


