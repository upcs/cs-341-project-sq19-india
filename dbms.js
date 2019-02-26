var mysql = require('mysql');

var con = mysql.createConnection({
	host: '35.236.96.52',
	user: 'student',
	password: 'intoPDX411',
	database: 'CS341'
});

con.connect(function(err) {
	if(err) throw err;
	con.query("SELECT COUNT(*) FROM ADDRESS", function(err, result, fields) {
		if(err) throw err;
		console.log(result);
	});
});