var products = [
];
products[1] = "Laphroaig 10y";
products[2] = "Famous Grouse";
products[3] = "Macallan 12y"; 
products[4] = "Highland Park";
var loginName = null;
var currentProduct = 0;
var currentResult = null;

function login() {
	// location.href = "index.jss?username=" + $("#username").val() + "&nickname=" + $("#nickname").val() + "&tab=1";  
	loginName = $("#username").val();
	 $.ajax({
           url: '/viski/login',
           type: 'POST',
           contentType: "application/json; charset=utf-8",
           dataType: 'json',
           data:  JSON.stringify(
        		   { "login" : loginName,
        			 "nickname" : $("#nickname").val()
           }),
           success: function (data, textStatus, xhr) {
               console.log(data);
               showArvostelu();
           },
           error: function (xhr, textStatus, errorThrown) {
               console.log('Error in Operation');
               alert("login failed: " + textStatus + " " + errorThrown);
           }

       });
}

function showArvostelu() {
	$( "#tabs" ).tabs({ active: 1 });
	initProducts();
	$( ".evaluation" ).slider({
	    value: 50,
		min: 0,
		max: 100,
		range: "min",
	    animate: true,
	 });
}

function showCurrentResult() {
	currentProduct =  $('#product').val();
	searchResult(currentProduct);
}

function searchResult(product) {
	$( "#tabs" ).tabs({ active: 2 });
	initProducts();
	$('#resultProduct').change(function() {
		currentProduct =  $('#resultProduct').val();
		showCurrentResult();
	});

	$.ajax({
         url: '/viski/result',
         type: 'POST',
         contentType: 'application/json; charset=utf-8',
         dataType: 'json',
         data:  JSON.stringify(
        		 {
        			"login" : loginName,
        			"product" : product
        		 }
         ),
         success: function (data, textStatus, xhr) {
             console.log(data);
             currentResult = data;
             showResult();
         },
         error: function (xhr, textStatus, errorThrown) {
             console.log('Error in Operation');
             alert("Save failed: " + textStatus + " " + errorThrown);
         }

     });
}

function showResult(result) {
	initProducts()
	$('#resultProduct').val(currentProduct);
	var chart = createAverageChart();
	chart.render();
	showPearson();
}




function initProducts() {
	for (var i in products) {
		$('#product').append('<option value="'+ i + '">' + products[i] + '</option>');
	}

}

function save() {
	currentProduct =  $("#product").val();
	 $.ajax({
         url: '/viski/save',
         type: 'POST',
         contentType: "application/json; charset=utf-8",
         dataType: 'json',
         data:  JSON.stringify(
        		 {
        			"login" : loginName, 
        			"product" : currentProduct,
        			"savuisuus" : $("#savuisuus").slider("value"),
        			"vaniljaisuus" :  $("#vaniljaisuus").slider("value"),
        			"kukkaisuus" : $("#kukkaisuus").slider("value"),
        			"mausteisuus" : $("#mausteisuus").slider("value"),
        			"maltaisuus" : $("#maltaisuus").slider("value"),
        			"makeus" : $("#makeus").slider("value"),
        			"miellyttavyys" : $("#miellyttavyys").slider("value")
         }),
         success: function (data, textStatus, xhr) {
             console.log(data);
             alert("Values saved");
         },
         error: function (xhr, textStatus, errorThrown) {
             console.log('Error in Operation');
             alert("Save failed: " + textStatus + " " + errorThrown);
         }

     });
 // $( "#tabs" ).tabs({ active: 2 });
}

function createAverageChart() {
	var json = currentResult;
	
	if (! json || json.own.length == 0) {
		$("#resultitle").html('Results not found, please log in');
		return;
	}
	var own = json.own[0];
	var avg = json.avg[0];
	$("#resultitle").html('<h4>Viski:' +  products[currentProduct] + '</h4>');
	return createChart(
			"chartAverage",
			"Omat tulokset vs. kaikkien keskiarvo ",
			"Oma arvio", 
			"Vastanneiden keskiarvo",
			own, 
			avg);
}
	
function createChart(id, title, axis1, axis2, data1, data2) {
	var json = currentResult;
	
	var chart = new CanvasJS.Chart(id,
	{
		theme: "theme3",
				animationEnabled: true,
		backgroundColor: "#2d1616",
		title:{
			text: title,
			fontSize: 20,
			fontColor: "white"
		},
		toolTip: {
			shared: true
		},			
		axisY: {
			title: '',
			minimum: 0,
			maximum: 100,
			interval: 100,
		},
		axisY2: {
			title: '',
			minimum: 0,
			maximum: 100,
			interval: 100
		},			
		data: [ 
		{
			type: "spline",	
			name: axis1,
			legendText:  axis1,
			showInLegend: true, 
			dataPoints:[
			{label: "Savuisuus", y: data1.savuisuus},
			{label: "Vaniljaisuus", y: data1.vaniljaisuus},
			{label: "Kukkaisuus", y: data1.kukkaisuus},
			{label: "Mausteisuus", y: data1.mausteisuus},
			{label: "Maltaisuus", y: data1.maltaisuus},
			{label: "Makeus", y: data1.makeus},
			{label: "Miellyttavyys", y: data1.miellyttavyys},
			]
		},
		{
			type: "spline",	
			name: axis2,
			legendText: axis2,
			axisYType: "secondary",
			showInLegend: true,
			dataPoints:[
			{label: "Savuisuus", y: data2.savuisuus},
			{label: "Vaniljaisuus", y: data2.vaniljaisuus},
			{label: "Kukkaisuus", y: data2.kukkaisuus},
			{label: "Mausteisuus", y: data2.mausteisuus},
			{label: "Maltaisuus", y: data2.maltaisuus},
			{label: "Makeus", y: data2.makeus},
			{label: "Miellyttavyys", y: data2.miellyttavyys},
			]
		}
		
		],
	  legend:{
		fontColor: "white",
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
	var result = currentResult;
	var pearsonlist = $('#pearsonlist');
	pearsonlist.empty();
	pearsonlist.append('<tr><th>Lempinimi</th><th>Korrelaatio</th></tr>');
	if (result) {
		pearson = calculatePearson(result.own[0], result.all);
		pearson.sort(function(a, b){
			return a.pearson - b.pearson;
		});
		for (var i = 0; i <= 2; i++) {
			if (pearson[i]) {
				pearsonlist.append('<tr><td><a href="#match' + i + '">' + 
						pearson[i].nickname + '</a></td><td>' + 
						parseFloat(pearson[i].pearson).toFixed(2) + '</td></tr>');
				showCompareChart('match' + i, pearson[i].nickname, result.own[0], result.all);
			}	
		}
	}
	else {
		return;
	}
}

function showCompareChart(id, nickname, own, json) {
	for (i in json) {
		var person = json[i];
		if (nickname == person.nickname) {
			var other = person;
		}
		
	}
	
	var chart =  createChart(
			id,
			'Omat tulokset vs. ' + nickname,
			'Oma arvio', 
			nickname,
			own, 
			other);
	
	chart.render();
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}
	
function getDBResult() {
	var result = getCookie("result");
	if (result) {
		return JSON.parse(result);
	}
	else {
		return null;
	}	
}
