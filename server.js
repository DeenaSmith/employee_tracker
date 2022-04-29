
// Requirements
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');


// Ties DB to SQL
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    user: 'root',
    password: '',
    database: 'employee_DB'
});

connection.query = util.promisify(connection.query);



// Start the application after establishing the connection.
connection.connect(function (err) {
    if (err) throw err;
    console.log("SQL is connected!");

    
})
