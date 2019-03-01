var express = require('express');
var router = express.Router();
const mysql = require('mysql');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
router.use(bodyParser.json());

const db = mysql.createConnection({
	host: '35.236.96.52',
	user: 'student',
	password: 'intoPDX411',
	database: 'CS341'
});

db.connect((err) => {
	if (err) throw err;
	console.log('MySQL is connected...');
});

router.get('/', function(req, res, next) {
	res.send('got the data');
});
router.post('/', urlencodedParser, function(req, res) {
	if(!req.body) return res.sendStatus(400);
	var x_coor = req.body.x_coor;
	var y_coor = req.body.y_coor;
	db.query("SELECT COUNT(*) AS count FROM ADDRESS WHERE X BETWEEN " + (x_coor + 250) + " AND " + (x_coor - 250) + " AND Y BETWEEN " + (y_coor + 250) + " AND " + (y_coor - 250), function(err, result) {
		if (err) throw err;
		console.log(result[0].count);
		res.end((result[0].count).toString());
	});
});

module.exports = router;