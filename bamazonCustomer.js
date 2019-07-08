// require node packages
var mysql = require("mysql");
var inquire = require("inquirer");

// set variable for mysql connection
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log ("connected as id " + connection.threadId);
  connection.end();
});