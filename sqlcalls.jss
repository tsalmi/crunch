<?
	var mysql      = require('mysql');
	
	var dbCreateUser = function(username, nickname) {	
		/* 
		*/
		var connection = createConnection();
		connection.connect(function(err)  { return "cannot connect to database" });
		write("connected to database<br>");
		var userData = { login: username, nickname: nickname };
		connection.query('insert into userdata set ?', userData, 
			function(err, res){
			if(err) write( "Error: " + err);
			else 
				write('Last insert ID: ' + res.insertId);
});
			
	/*	
		function(err, rows, fields) {
			write(JSON.stringify(rows));
			
			if (err) throw err;
			for (var i = 0; i < rows.length; i++) {
				var name = rows[i].name;
				write('index' + i);
				write('Row: ' + i + " name: " + name + JSON.stringify(rows[i]));
			}
		});
*/
		connection.end();
	 }

	var dbCreateEvaluation = function(evaluation) {	
		/* 
		*/
		var connection = createConnection();
		connection.connect(function(err)  { return "cannot connect to database" });
		write("connected to database<br>");
		connection.query('insert into evaluation set ?', evaluation, 
			function(err, res){
			if(err) write( "Error: " + err);
			return write('Last insert ID: ' + res.insertId);
			});
	}
			
	 
	 
	 var createConnection = function() {
		 var connection = mysql.createConnection({
			host 	: 'localhost',
			user 	: 'root',
			password: 'qwerty',
			database: 'viski'
		/*
			host     : 'mmdsql01.mmd.net',
			user     : 'uniqueel',
			password : 'qvBzZY8xkGrxffp3',
			database : 'uniqueel'
			*/
		});
		return connection;		
	 }
?>
