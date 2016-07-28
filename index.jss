<?
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
			        	 "FROM evaluation " +
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
				/*
				host 	: 'localhost',
				user 	: 'root',
				password: 'qwerty',
				database: 'viski'
				*/ 
				host     : 'mmdsql01.mmd.net',
				user     : 'uniqueel',
				password : 'qvBzZY8xkGrxffp3',
				database : 'uniqueel'
				
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
	}
?>
<!doctype html>
<html lang="us">
<head>
	<meta charset="utf-8">
	<title>Tast page</title>
	<link href="jquery/jquery-ui.css" rel="stylesheet">
	<link href="front.css" rel="stylesheet">
	<script src="jquery/external/jquery/jquery.js"></script>
	<script type="text/javascript" src="jquery/url.js"></script>
	<script src="jquery/jquery-ui.js"></script>
	<script type="text/javascript" src="canvas/jquery.canvasjs.min.js"></script>
	<script type="text/javascript" src="front.js"></script>
</head>
<body>
<div id="tabs">
	<ul>
		<li><a href="#tabs-1">Log in</a></li>
		<li><a href="#tabs-2">Evaluation</a></li>
		<li><a href="#tabs-3">See summary</a></li>
	</ul>
	<div id="tabs-1">
		<p>
			<label for="username">Username</label>
			<input type="text" id="username">
		</p>
		<p>
			<label for="nickname">Nickname</label>
			<input type="text" id="nickname">
		</p>
		<p>
			<button id="button" class="button" onclick="login()">Next</button>
		</p>
	</div>
	<div id="tabs-2">
		<p>
			<h2 class="demoHeaders">Choose</h2>
			<select id="product">
				
			</select>
		</p>
		<p>
			  <h4>Evaluation 1</h4>
			  <div id="savuisuus" class="evaluation"></div>
		</p>
		<p>
			  <h4>Evaluation 2</h4>
			  <div id="vaniljaisuus" class="evaluation"></div>
		 </p>
		<p>
			  <h4>Evaluation 3</h4>
			  <div id="kukkaisuus" class="evaluation"></div>
		</p>
		<p>
			  <h4>Evaluation 4</h4>
			  <div id="mausteisuus" class="evaluation"></div>
		</p>
		<p>
			  <h4>Evaluation 5</h4>
			  <div id="maltaisuus" class="evaluation"></div>
		</p>		
		<p>
			  <h4>Evaluation 6</h4>
			  <div id="makeus" class="evaluation"></div>
		</p>		
		<p>
			  <h4>Evaluation 7</h4>
			  <div id="miellyttavyys" class="evaluation"></div>
		</p>
		<p></p>
		<p>
			<button id="button" class="button" onclick="results()">Next</button>
		</p>
	</div>
	<div id="tabs-3">
		<span id="result"></span>
		<div id="chartContainer" style="height: 300px; width: 100%;">
		</div>
	</div>
</div>
<script>
	var tab = url("?tab");
	var action = url("?action");
	if (! tab) {
		tab = 0;
	}	
	initProducts();
	$( "#tabs" ).tabs({ active: tab });
	$( ".button" ).button();
	$( "#selectmenu" ).selectmenu();		
	$( ".evaluation" ).slider({
        value: 50,
		min: 0,
		max: 100,
		range: "min",
        animate: true,
     });
	var chart = createChart(product);
	chart.render();
	$( document ).ready(function() {
		if (action == 'save') {
			document.location.href = '/index.jss?tab=2';
		}
	});

</script>
</body>
</html>