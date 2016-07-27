var products = [
];
products[1] = "Lumia";
products[2] = "Windows 10";


function login() {
	location.href = "front.jss?username=" + $("#username").val() + "&nickname=" + $("#nickname").val() + "&tab=1";  
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
	location.href = 'front.jss?action=save&tab=1' +
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
	var own = json.own[0];
	var all = json.all[0];
	
	var chart = new CanvasJS.Chart("chartContainer",
	{
		theme: "theme3",
				animationEnabled: true,
		title:{
			text: "Survey results",
			fontSize: 30
		},
		toolTip: {
			shared: true
		},			
		axisY: {
			title: "Oma arviointi"
		},
		axisY2: {
			title: "Käyttäjien mediaani"
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
			name: "Kaikkien keskiarvo",
			legendText: "Kaikkien keskiarvo",
			axisYType: "secondary",
			showInLegend: true,
			dataPoints:[
			{label: "Savuisuus", y: all.savuisuus},
			{label: "Vaniljaisuus", y: all.vaniljaisuus},
			{label: "Kukkaisuus", y: all.kukkaisuus},
			{label: "Mausteisuus", y: all.mausteisuus},
			{label: "Maltaisuus", y: all.maltaisuus},
			{label: "Makeus", y: all.makeus},
			{label: "Miellyttavyys", y: all.miellyttavyys},
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

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
	