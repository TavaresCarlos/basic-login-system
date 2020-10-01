var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

const connection = mysql.createConnection({
	host: 'localhost',
	port: '3306',
	user: 'root',
	password: '123456',
	database: 'tcc'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (request, response) => {
	response.sendFile(path.join(__dirname + '/index.html'))
});

app.post('/auth', (request, response) => {
	var username = request.body.username;
	var password = request.body.password;

	console.log(username);
	console.log(password);	

	if(username && password){
		connection.query('SELECT * FROM usuario WHERE nome = ? AND senha = ?', [username, password], function(error, results, fields){
			console.log(results);

			if (results.length > 0){
				request.session.loggedin = true;
				request.session.username = username;
				response.redirect('/login');
				console.log('Query realizada');
			}
			else{
				response.send('Incorrect username and/or password');
				console.log('Incorrect username and/or password');
			}
			response.end();
		});
	}
	else{
		response.send('Please enter username and/or password');
		response.end();
	}
});

app.get('/login', (request, response) => {
	console.log("HOME");
	if(request.session.loggedin){
		console.log('Welcome back, ' + request.session.username);
		response.redirect('/home');
	}
	else{
		console.log('Please login to view this page');
	}
	response.end();
})

app.get('/home', (request, response) => {
	console.log("INICIO");
	response.sendFile(path.join(__dirname + '/home.html'));
})

app.listen(3000)
console.log('API funcionando');