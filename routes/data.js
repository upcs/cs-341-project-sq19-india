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
	var radius = parseFloat(req.body.radius);
	var xLeftBound = x_coor - 0.1;
	var xRightBound = x_coor + 0.1;
	var yLoBound = y_coor - 0.1;
	var yUpBound = y_coor + 0.1;

	console.log("coordinates received: \nx: "+x_coor+"\ny: "+y_coor+"\nradius: "+radius);
	
	var policeQuery = "SELECT COUNT(*) FROM POLICE WHERE (X="+parseInt(x_coor)+") AND (Y="+parseInt(y_coor)+")";
	var farmerMktQuery = "SELECT COUNT(*) FROM FARMERMKT WHERE (X="+parseInt(x_coor)+") AND (Y="+parseInt(y_coor)+")";
	var tierOneQuery = "SELECT COUNT(*) FROM TIERONE WHERE (X BETWEEN "+xLeftBound+" AND "+xRightBound+") AND (Y BETWEEN "+yLoBound+" AND "+yUpBound+")";
	var query = "SELECT ("+policeQuery+") AS policeCount,("+farmerMktQuery+") AS mktCount,("+tierOneQuery+") AS tierOneCount";
	
	console.log("query: "+query);

	db.query(query, function(err, result) {
		if (err) throw err;
		console.log(result);
		var data = {"policeCount":result[0].policeCount, "mktCount":result[0].mktCount, "tierOneCount":result[0].tierOneCount};
		res.end(JSON.stringify(data));
	});
});

module.exports = router;