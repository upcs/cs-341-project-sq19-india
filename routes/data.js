/*
	Database
	Author: Huy Nguyen
	Version: 2/28/2019
*/
var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var bodyParser = require('body-parser');
//Middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());
//Create connection to the portland database
const db = mysql.createConnection({
	host: '35.236.96.52',
	user: 'student',
	password: 'intoPDX411',
	database: 'CS341'
});
//Connect
db.connect((err) => {
	if (err) throw err;
	console.log('MySQL is connected...');
});
//Handling the post from the client
router.post('/', urlencodedParser, function(req, res) {
	//Check for error
	if(!req.body) return res.sendStatus(400);
	//Store inputs from client
	var x_coor = req.body.x_coor;
	var y_coor = req.body.y_coor;
	//Get the data from the database
	db.query("SELECT COUNT(*) AS count FROM ADDRESS WHERE X BETWEEN " + (x_coor + 250) + " AND " + (x_coor - 250) + " AND Y BETWEEN " + (y_coor + 250) + " AND " + (y_coor - 250), function(err, result) {
		if (err) throw err;
		console.log(result[0].count);
		//Send the data back to the client
		res.end((result[0].count).toString());
	});
});

module.exports = router;