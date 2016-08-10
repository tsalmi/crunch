var products = [
];
products[1] = "Laphroaig 10y";
products[2] = "Famous Grouse";
products[3] = "Macallan 12y";
products[4] = "Highland Park";


function login() {
	location.href = "index.jss?username=" + $("#username").val() + "&nickname=" + $("#nickname").val() + "&tab=1";  
	// $( "#tabs" ).tabs({ active: 1 });
}

function initProducts() {
	for (var i in products) {
		$('#product').append('<option value="'+ i + '">' + products[i] + '</option>');
	}
}

function results() {
	var savuisuus = $("#savuisuus").slider("value");
	var vaniljaisuus =  $("#vaniljaisuus").slider("value");
	var kukkaisuus = $("#kukkaisuus").slider("value");
	var mausteisuus = $("#mausteisuus").slider("value");
	var maltaisuus = $("#maltaisuus").slider("value");
	var makeus = $("#makeus").slider("value");
	var miellyttavyys = $("#miellyttavyys").slider("value");
	var product = $("#product").val();
	location.href = 'index.jss?action=save&tab=1' +
	'&product=' + product +
	'&savuisuus=' + savuisuus + 
	'&vaniljaisuus=' + vaniljaisuus + 
	'&kukkaisuus=' + kukkaisuus +
	'&mausteisuus=' + mausteisuus + 
	'&maltaisuus=' + maltaisuus + 
    '&makeus=' + makeus + 
	'&miellyttavyys=' + miellyttavyys;
//	$( "#tabs" ).tabs({ active: 2 });
}

function createChart() {
	var result = getCookie("result");
	if (result) {
		var json = JSON.parse(result);
	}
	else {
		return;
	}
	var own = json.own[0];
	var avg = json.avg[0];
	var all = json.all[0];
	
	var chart = new CanvasJS.Chart("chartContainer",
	{
		theme: "theme3",
				animationEnabled: true,
		title:{
			text: "Tulokset viskille " + products[json.product],
			fontSize: 30
		},
		toolTip: {
			shared: true
		},			
		axisY: {
			title: "Oma arvio",
			minimum: 0,
			maximum: 100,
		},
		axisY2: {
			title: "Vastanneiden keskiarvo",
			minimum: 0,
			maximum: 100,			
		},			
		data: [ 
		{
			type: "column",	
			name: "Oma arvio",
			legendText: "Oma arvio",
			showInLegend: true, 
			dataPoints:[
			{label: "Savuisuus", y: own.savuisuus},
			{label: "Vaniljaisuus", y: own.vaniljaisuus},
			{label: "Kukkaisuus", y: own.kukkaisuus},
			{label: "Mausteisuus", y: own.mausteisuus},
			{label: "Maltaisuus", y: own.maltaisuus},
			{label: "Makeus", y: own.makeus},
			{label: "Miellyttavyys", y: own.miellyttavyys},
			]
		},
		{
			type: "column",	
			name: "Vastanneiden keskiarvo",
			legendText: "Vastanneiden keskiarvo",
			axisYType: "secondary",
			showInLegend: true,
			dataPoints:[
			{label: "Savuisuus", y: avg.savuisuus},
			{label: "Vaniljaisuus", y: avg.vaniljaisuus},
			{label: "Kukkaisuus", y: avg.kukkaisuus},
			{label: "Mausteisuus", y: avg.mausteisuus},
			{label: "Maltaisuus", y: avg.maltaisuus},
			{label: "Makeus", y: avg.makeus},
			{label: "Miellyttavyys", y: avg.miellyttavyys},
			]
		}
		
		],
	  legend:{
		cursor:"pointer",
		itemclick: function(e){
		  if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		  }
		  else {
			e.dataSeries.visible = true;
		  }
			chart.render();
		}
	  },
	});
	return chart;
}

var showPearson = function() {
	var result = getCookie("result");
	if (result) {
		var json = JSON.parse(result);
		calculatePearson(json.own[0], json.all);
	}
	else {
		return;
	}
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
	