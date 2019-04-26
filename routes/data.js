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

router.post('/',  urlencodedParser, function(req, res) {
	if(!req.body) return res.sendStatus(400);
	var x_coor = parseFloat(req.body.x_coor);
	var y_coor = parseFloat(req.body.y_coor);
	var radius = parseFloat(req.body.radius);
	var angle = parseFloat(req.body.angle);
	var disasterType = req.body.disaster;

	/*
	console.log("coordinates received: \nx: "+x_coor+"\ny: "+y_coor+"\nradius: "+radius);
	console.log(req.body);

	var radiusPythag = "(X-"+x_coor+")*(X-"+x_coor+") + (Y-"+y_coor+")*(Y-"+y_coor+")<"+radius+"*"+radius;
	
	var policeQuery = "SELECT COUNT(*) FROM POLICE WHERE "+radiusPythag;
	var farmerMktQuery = "SELECT COUNT(*) FROM FARMERMKT WHERE "+radiusPythag;
	var tierOneQuery = "SELECT COUNT(*) FROM TIERONE WHERE "+radiusPythag;
	var query = "SELECT ("+policeQuery+") AS policeCount,("+farmerMktQuery+") AS mktCount,("+tierOneQuery+") AS tierOneCount;";
	
	console.log("query: "+query);
	*/
	var policeQuery;
	var farmerMktQuery;
	var tierOneQuery;
	var query;
	console.log('checking disaster type.');
	switch(disasterType){

		default:
			console.log("eq or torn");
			var radiusPythag = "(X-"+x_coor+")*(X-"+x_coor+") + (Y-"+y_coor+")*(Y-"+y_coor+")<"+radius+"*"+radius;
		
			var policeQuery = "SELECT COUNT(*) FROM POLICE WHERE "+radiusPythag;
			var farmerMktQuery = "SELECT COUNT(*) FROM FARMERMKT WHERE "+radiusPythag;
			var tierOneQuery = "SELECT COUNT(*) FROM TIERONE WHERE "+radiusPythag;

			query = "SELECT ("+policeQuery+") AS policeCount,("+farmerMktQuery+") AS mktCount,("+tierOneQuery+") AS tierOneCount;";
			break;

		case 'Flood':
			var floodCoords = [
				{lat: 45.92,lng: -122.81 },
				{lat: 45.86 ,lng: -122.79},
				{lat: 45.79,lng: -122.78},
				{lat: 45.72,lng: -122.76},
				{lat: 45.65,lng: -122.75},
				{lat: 45.61,lng: -122.67},
				{lat: 45.60,lng: -122.58},
				{lat: 45.57,lng: -122.49},
				{lat: 45.56,lng: -122.39},
				{lat: 45.54,lng: -122.29},
				{lat: 45.56,lng: -122.19},
				{lat: 45.59,lng: -122.77},
				{lat: 45.55,lng: -122.70},
				{lat: 45.51,lng: -122.67},
				{lat: 45.45,lng: -122.65},
				{lat: 45.39,lng: -122.64},
				{lat: 45.34,lng: -122.62},
			  ];
			var inAnyCircle = "";
			for(var i = 0; i < floodCoords.length; i++){
				var curCenter = floodCoords[i];
				inAnyCircle += "((X-"+curCenter.lng+")*(X-"+curCenter.lng+") + (Y-"+curCenter.lat+")*(Y-"+curCenter.lat+")<"+radius+"*"+radius+") OR ";
			}
			inAnyCircle = inAnyCircle.substring(0, inAnyCircle.length-4); //get rid of the extra 'OR'
			console.log(inAnyCircle);

			policeQuery = "SELECT COUNT(*) FROM POLICE WHERE "+inAnyCircle;
			farmerMktQuery = "SELECT COUNT(*) FROM FARMERMKT WHERE "+inAnyCircle;
			tierOneQuery = "SELECT COUNT(*) FROM TIERONE WHERE "+inAnyCircle;

			query = "SELECT ("+policeQuery+") AS policeCount,("+farmerMktQuery+") AS mktCount,("+tierOneQuery+") AS tierOneCount;";
		}
	


	db.query(query, function(err, result) {
		if (err) db.connect((err)=> {if (err) throw err;});
		console.log(result);
		var data = {"policeCount":result[0].policeCount, "mktCount":result[0].mktCount, "tierOneCount":result[0].tierOneCount};
		res.end(JSON.stringify(data));
	});
});

module.exports = router;
