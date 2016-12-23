/* jslint node: true */
'use strict';

const connectionString = 'postgres://postgres:ryipa@localhost:5432/postgres';

var fs = require('fs')
  , express = require('express')
  , pg = require('pg')
  , app = express()
  , buildPath = express.static(__dirname)
  , bodyParser = require('body-parser');;

app.use(buildPath);
app.use(bodyParser.json());  

var server = app.listen(5100, function () {
  var host = server.address().address;
  var port = server.address().port;
  // console.log('dataPath: ', dataPath);

  console.log('Server is running on http://%s:%s', host, port);
});


app.post('/viski/login', function(req,res) {
	var statsArr = [];
	const client = new pg.Client(connectionString);
	const data = { body: req.body };
	pg.connect(connectionString, (err, client, done) => {
		    // Handle connection errors
		    if(err) {
		      done();
		      console.log(err);
		      return res.status(500).json({success: false, data: err});
		    }
		    var results = [];
		 
		    const query = client.query('delete from viski.userdata where login = $1', 
		            [ data.body.login]);
		    query.on('end', () => {
		      const query2 = client.query('INSERT into viski.userdata (login, nickname) VALUES($1, $2)', 
			            [ data.body.login, data.body.nickname]);
		      query2.on('end', () => {
		    	  done();
		    	  console.log("Created user: " + data.body.login);
		    	  return res.json(results);
		      });
		    });
	  });		  
});
 

app.post('/viski/save', function(req,res) {
	const data = { body: req.body }
	 pg.connect(connectionString, (err, client, done) => {
		 	const evaluation = data.body;
		    // Handle connection errors
		    if(err) {
		      done();
		      console.log(err);
		      return res.status(500).json({success: false, data: err});
		    }
		    var results = [];
		    const query = client.query('delete from viski.evaluation where product = $1 and login = $2', 
		    		[ evaluation.product, evaluation.login]);
		    // Stream results back one row at a time
		    query.on('row', (row) => {
		      results.push(row);
		    });
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
				app.createEvaluation(evaluation, res);		    	
		    });
	  });		  
});



app.createEvaluation = function(evaluation, res) {
	const client = new pg.Client(connectionString);
	pg.connect(connectionString, (err, client, done) => {
	 	const query = client.query("insert into viski.evaluation(login, product, savuisuus, vaniljaisuus, kukkaisuus, mausteisuus, maltaisuus, makeus, miellyttavyys) " +
			"values($1, $2, $3, $4, $5, $6, $7, $8, $9)",
			[ evaluation.login, evaluation.product, evaluation.savuisuus, evaluation.vaniljaisuus,
			evaluation.kukkaisuus, evaluation.mausteisuus, evaluation.maltaisuus, evaluation.makeus, evaluation.miellyttavyys]);
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      console.log("Created evaluation: " + evaluation);
      return res.status(200).json({success: true, data: 'ok'});
    	});
	});		  
}


app.post('/viski/result', function(req,res) {
	const data = { body: req.body }
	var results = {
			own: [],
			all: [],
			avg: []
	}
	 pg.connect(connectionString, (err, client, done) => {
		 	const evaluation = data.body;
		    // Handle connection errors
		    if(err) {
		      done();
		      console.log(err);
		      return res.status(500).json({success: false, data: err});
		    }
		    const query = client.query('SELECT * FROM viski.evaluation where product=$1 and login=$2', 
		    		[ evaluation.product, evaluation.login]);
		    // Stream results back one row at a time
		    query.on('row', (row) => {
		      results.own.push(row);
		    });
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
				app.findAvgEvaluation(evaluation, results, res);		    	
		    });
	  });		  
});


app.findAvgEvaluation = function(evaluation, results, res) {
	 pg.connect(connectionString, (err, client, done) => {
		    // Handle connection errors
		    if(err) {
		      done();
		      console.log(err);
		      return res.status(500).json({success: false, data: err});
		    }
		    const query = client.query('select avg(savuisuus) savuisuus, avg(vaniljaisuus) vaniljaisuus, avg(kukkaisuus) kukkaisuus,' +
        			'avg(mausteisuus) mausteisuus, avg(maltaisuus) maltaisuus, avg(makeus) makeus, avg(miellyttavyys) miellyttavyys '+
        			'FROM viski.evaluation ' +
        			'where product=$1', 
		    		[ evaluation.product]);
		    // Stream results back one row at a time
		    query.on('row', (row) => {
		      results.avg.push(row);
		    });
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
				app.findAllEvaluation(evaluation, results, res);		    	
		    });
	  });		  	
}

app.findAllEvaluation = function(evaluation, results, res) {
	 pg.connect(connectionString, (err, client, done) => {
		    // Handle connection errors
		    if(err) {
		      done();
		      console.log(err);
		      return res.status(500).json({success: false, data: err});
		    }
		    const query = client.query("select e.login login, nickname, savuisuus, vaniljaisuus, kukkaisuus," +
        			"mausteisuus, maltaisuus, makeus, miellyttavyys " +
        			"FROM viski.evaluation e "+
        			"join viski.userdata u on u.login = e.login "+ 
        			"where product=$1", [evaluation.product]);
		    // Stream results back one row at a time
		    query.on('row', (row) => {
		      results.all.push(row);
		    });
		    // After all data is returned, close connection and return results
		    query.on('end', () => {
		    	 return res.json(results);		    	
		    });
	  });		  	
}


process.on('SIGINT', function() {
  // mongoose.connection.close(function () {
  //   console.log('Mongoose default connection disconnected through app termination');
  //   process.exit(0);
  // });
  process.exit(0);
});
