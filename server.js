var express = require('express');
var jwt = require("jsonwebtoken");
var app = express();

var secret = "652af32880df5748cbf37bd6273d8bfe444e76e551012ca323afa69e1f1b41ab";

app.route('/sign').post(function (req, res, next) {
	
	console.log(req.query);
	var token = jwt.sign(req.body, secret);

	res.writeHead(200, {
		'content-type': "text/html"
	});

	res.write(token);
	res.end();
});



app.listen(process.env.PORT || 3001);