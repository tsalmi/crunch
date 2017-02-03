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
               mainPage();
           },
           error: function (xhr, textStatus, errorThrown) {
               console.log('Error in Operation');
               alert("login failed: " + textStatus + " " + errorThrown);
           }

       });
}

function mainPage() {
	$( "#tabs" ).tabs({ active: 1 });
}

function showArvostelu() {
	$( "#tabs" ).tabs({ active: 2 });
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
	if (!currentProduct || currentProduct == 0) {
		currentProduct = 1;
	}
	searchResult(currentProduct);
}


function searchResult(product) {
	$( "#tabs" ).tabs({ active: 3 });
	$("#chartAverage").empty();
	$("#match0").empty();
	$("#match1").empty();
	$("#match2").empty();
	$("#pearsonlist").empty();
	
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

function showResult() {
	var chart = createAverageChart();
	if (chart) {
		chart.render();
		showPearson();
	}
}


function initProducts() {
	$('#product').empty();
	for (var i in products) {
		$('#product').append('<option value="'+ i + '">' + products[i] + '</option>');
	}
	$('#resultProduct').empty();
	for (var i in products) {
		$('#resultProduct').append('<option value="'+ i + '">' + products[i] + '</option>');
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
		$("#resultitle").html('Results not found');
		return false;
	}
	var own = json.own[0];
	var avg = json.avg[0];
	$("#resultitle").html('<h4>Whisky:' +  products[currentProduct] + '</h4>');
	return createChart(
			"chartAverage",
			"My nose agains average ",
			"My nose", 
			"Average",
			own, 
			avg);
}
	
function createChart(id, title, axis1, axis2, data1, data2) {
	$('#' + id).empty();
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
			{label: "Smokiness", y: data1.savuisuus},
			{label: "Vanillin", y: data1.vaniljaisuus},
			{label: "Floral", y: data1.kukkaisuus},
			{label: "Spiciness", y: data1.mausteisuus},
			{label: "Maltiness", y: data1.maltaisuus},
			{label: "Sweetness", y: data1.makeus},
			{label: "Amenity", y: data1.miellyttavyys},
			]
		},
		{
			type: "spline",	
			name: axis2,
			legendText: axis2,
			axisYType: "secondary",
			showInLegend: true,
			dataPoints:[
			{label: "Smokiness", y: Math.round(data2.savuisuus)},
			{label: "Vanillin", y: Math.round(data2.vaniljaisuus)},
			{label: "Floral", y: Math.round(data2.kukkaisuus)},
			{label: "Spiciness", y: Math.round(data2.mausteisuus)},
			{label: "Maltiness", y: Math.round(data2.maltaisuus)},
			{label: "Sweetness", y: Math.round(data2.makeus)},
			{label: "Amenity", y: Math.round(data2.miellyttavyys)},
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
	pearsonlist.append('<tr><th>Nickname</th><th>Correlation</th></tr>');
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
			'My nose agains ' + nickname,
			'My nose', 
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
