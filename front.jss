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
<?
	include("/timopersonal/viski/sqlcalls.jss");
	if (request.query.username) {
		session.data.username = request.query.username;
		dbCreateUser(session.data.username, request.query.nickname);		
	}
	write("Query: " + request.query.username);
	write("<br>session: " + session.data.username);
	
	if (request.query.savuisuus) {
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
				<option value="1">Lumia</option>
				<option value="2">Windows 10 Standard edition</option>
				<option value="3">Windows 10 Enterprice</option>
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
		<div id="chartContainer" style="height: 300px; width: 100%;">
		</div>
	</div>
</div>
<script>
	var tab = url("?tab");
	if (! tab) {
		tab = 0;
	}	
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
	
	var chart = createChart();
	chart.render();

</script>
</body>
</html>