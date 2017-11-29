var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_danielj',
  password        : '0391',
  database        : 'cs340_danielj'
});

module.exports.pool = pool;
