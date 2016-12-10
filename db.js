var database = function() {
	var saveDone = false;
	if (session.data.result) {	
		response.headers['Set-Cookie']  = 'result=' + JSON.stringify(session.data.result);
	}
		//	
		// SQL CALLS 
		//
			
		var mysql      = require('mysql');
		
		var dbCreateUser = function(username, nickname) {	
			/* 
			*/
			var connection = createConnection();
			connection.connect(function(err)  { if (err) write("cannot connect to database"); }); 
			// write("connected to database<br>");
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
								// write('Last insert ID: ' + res.insertId);
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
			connection.connect(function(err)  { if (err) write("cannot connect to database") });
			connection.query('delete from evaluation where product = ? and login = ?', [ evaluation.product, evaluation.login], 
				function(err, res){
					if(err) { 
						write( "Error: " + err);						
						connection.end();
					}
					else {
						write( "Deleted: " + err);
						connection.query('insert into evaluation set ?', evaluation, 
							function(err, res){
								if(err) { 
									write( "Error: " + err);
									connection.end();		
								}
								else {
									write( "inserted: " + err);
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
			        	dbFindAvgEvaluations(connection, product);			        			        	
			        }
			});
						
		} 

		var dbFindAvgEvaluations = function(connection, product) {
        	connection.query(
        			"select avg(savuisuus) savuisuus, avg(vaniljaisuus) vaniljaisuus, avg(kukkaisuus) kukkaisuus," +
        			"avg(mausteisuus) mausteisuus, avg(maltaisuus) maltaisuus, avg(makeus) makeus, avg(miellyttavyys) miellyttavyys "+
        			"FROM evaluation " +
        			"where product=?", [product],
			 			function(err, rows, fields) {				
			 		        if (err) {
			 		        	write(err);
			 		        }
			 		        else {
			 		        	write( "<br>found");
			 		        	session.data.result.avg = rows;			
			 		        	session.data.result.product = product;
			 		        	dbFindAllEvaluations(connection, product);
			 		        }			 		        
			        	});
		}
		 

		var dbFindAllEvaluations = function(connection, product) {
        	connection.query(
        			"select e.login login, nickname, savuisuus, vaniljaisuus, kukkaisuus," +
        			"mausteisuus, maltaisuus, makeus, miellyttavyys " +
        			"FROM evaluation e "+
        			"join userdata u on u.login = e.login "+ 
        			"where product=?", [product],
			 			function(err, rows, fields) {				
			 		        if (err) {
			 		        	write(err);
			 		        }
			 		        else {
			 		        	write( "<br>found");
			 		        	session.data.result.all = rows;			
			 		        }			 		        
			        	});
        	connection.end();
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

	if (request.query.username) {
		session.data.username = request.query.username;
		dbCreateUser(session.data.username, request.query.nickname);		
	}
	if (request.query.action == 'save') {
		// session.data.result.all = null; 
		dbCreateEvaluation({
			login : session.data.username,
			product: request.query.product,
			savuisuus : request.query.savuisuus,
			vaniljaisuus : request.query.vaniljaisuus,
			kukkaisuus : request.query.kukkaisuus,
			mausteisuus : request.query.mausteisuus, 
			maltaisuus : request.query.maltaisuus,
			makeus : request.query.makeus,
			miellyttavyys : request.query.miellyttavyys
		});
		//while (!session.data.result.all) {
		//}
	}	
}