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
	var x_coor = parseFloat(req.body.x_coor);
	var y_coor = parseFloat(req.body.y_coor);

	console.log("coordinates recived: \nx: "+x_coor+"\ny: "+y_coor);

	var xRightBound = x_coor + 0.1;
	var xLeftBound = x_coor - 0.1;
	var yUpBound = y_coor + 0.1;
	var yLoBound = y_coor - 0.1;

	var query = "SELECT COUNT(*) AS count FROM TIERONE WHERE (X BETWEEN "+xLeftBound+" AND "+xRightBound+") AND (Y BETWEEN "+yLoBound+" AND "+yUpBound+");";
	console.log("query: "+query);

	db.query(query, function(err, result) {
		if (err) throw err;
		console.log(result);
		res.end((result[0].count).toString());
	});
});

module.exports = router;