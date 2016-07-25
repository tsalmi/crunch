<html>
    <body>
	<p id="demo"></p>
	demox
<?
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
        host     : 'mmdsql01.mmd.net',
        user     : 'uniqueel',
        password : 'qvBzZY8xkGrxffp3',
        database : 'uniqueel'
    });

    write("trying to connect...");
    connection.connect(); 
    write("connected");
    connection.query('SELECT * FROM employees', function(err, rows, fields) {
		write(JSON.stringify(rows));
		
        if (err) throw err;
		for (var i = 0; i < rows.length; i++) {
			var name = rows[i].name;
			write('index' + i);
			write('Row: ' + i + " name: " + name + JSON.stringify(rows[i]));
		}
    });

    connection.end();
?>

    </body>
</html>

