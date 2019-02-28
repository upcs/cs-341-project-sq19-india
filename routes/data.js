var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const db = mysql.createConnection({
	host: '35.236.96.52',
	user: 'student',
	password: 'intoPDX',
	database: 'CS341'
});
/*
db.connect((err) => {
	if (err) throw err;
	console.log('MySQL is connected...');
});
*/
router.get('/', function(req, res, next) {
	res.send('got the data');
});
router.post('/', urlencodedParser, function(req, res) {
	if(!req.body) return res.sendStatus(400);
	var x-coor = req.body.x-coor;
	var y-coor = req.body.y-coor;
	db.query("SELECT COUNT(*) FROM ADDRESS WHERE X < " + (x-coor + 250) + "AND X > " + (x-coor - 250) + "OR Y < " + (y-coor + 250) "AND Y > " + (y-coor - 250), function(err, result) {
		if (err) throw err;
		res.end(result);
	});
});

module.exports = router;