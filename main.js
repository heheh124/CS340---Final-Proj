
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));

app.use('/static', express.static('public'));

app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use(bodyParser.json());

app.get('/home', function (req, res){
	res.render('home');
})
app.use('/handguns', require('./handguns.js'));
app.use('/rifles', require('./rifles.js'));
app.use('/accessories', require('./accessories.js'));
app.use('/ammunition', require('./ammunition.js'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
