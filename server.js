
// Requirements
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const util = require('util');


// Ties DB to SQL
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_DB'
});

connection.query = util.promisify(connection.query);



// Start the application after establishing connection
connection.connect(function (err) {
    if (err) throw err;
    console.log("SQL is connected!");

    initiate();

});



// Initial prompt
function initiate() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View departments", "View roles", "View employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
            name: "initiate"
        }
    ]).then(function(res) {
        switch(res.initiate){
            case "View departments":
                viewDepartments();
                break;

            case "View roles":
                viewRoles();
                break;

            case "View employees":
                viewEmployees();
                break;

            case "Add a department":
                addDepartment();
                break;

            case "Add a role":
                addRole();
                break;

            case "Add an employee":
                addEmployee();
                break;

            case "Update an employee role":
                updateEmployee();
                break;

            case "Exit":
                console.log("Live long and prosper.")
        }
    })
};



initiate();