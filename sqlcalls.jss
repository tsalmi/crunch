<?
	//	
	// SQL CALLS 
	//
		
	var mysql      = require('mysql');
	
	var dbCreateUser = function(username, nickname) {	
		/* 
		*/
		var connection = createConnection();
		connection.connect(function(err)  { return "cannot connect to database" });
		write("connected to database<br>");
		var userData = { login: username, nickname: nickname };
		connection.query('delete from userdata where login = ?', [ username ], 
			function(err, res){
				if(err) { 
					write( "Error: " + err);
					connection.end();
				}
				else {
					connection.query('insert into userdata set ?', userData, 
						function(err, res){
						if(err)  {
							write( "Error: " + err);
						}
						else { 
							write('Last insert ID: ' + res.insertId);
						}
					});
					connection.end();
				}
		});		
	 }

	var dbCreateEvaluation = function(evaluation) {	
		/* 
		*/
		var connection = createConnection();
		connection.connect(function(err)  { write("cannot connect to database") });
		connection.query('delete from evaluation where product = ? and login = ?', [ evaluation.product, evaluation.login], 
			function(err, res){
				if(err) { 
					write( "Error: " + err);
					connection.end();
				}
				else {
					connection.query('insert into evaluation set ?', evaluation, 
						function(err, res){
							if(err) { 
								write( "Error: " + err);
								connection.end();		
							}
							else {
								dbFindEvaluations(connection, evaluation.product, evaluation.login);
							}				
					});
				}				
			});
	}
			
	var dbFindEvaluations = function(connection, product, login) {
		session.data.result = {};
		connection.query("SELECT * FROM evaluation where product=? and login=?", [product, login], 
			function(err, rows, fields) {				
		        if (err) {
		        	write(err);
		        	connection.end();
		        }
		        else {
		        	session.data.result.own = rows;			        			        	
		        	connection.query("select avg(savuisuus) savuisuus, avg(vaniljaisuus) vaniljaisuus, avg(kukkaisuus) kukkaisuus," +
		        			"avg(mausteisuus) mausteisuus, avg(maltaisuus) maltaisuus, avg(makeus) makeus, avg(miellyttavyys) miellyttavyys "+
		        	 "FROM viski.evaluation " +
		        	 "where product=?", [product],
		 			function(err, rows, fields) {				
		 		        if (err) {
		 		        	write(err);
		 		        }
		 		        else {
		 		        	session.data.result.all = rows;			
		 		        	session.data.result.product = product;
		 		        }
		        	});
		        	connection.end();
		        }
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
	 
	 // 
	 // END SQLCALLS
?>
