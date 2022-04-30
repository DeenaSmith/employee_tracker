
// Requirements
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require("dotenv").config();
const util = require('util');


// Ties DB to SQL
let connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: 'employee_DB'
},
    console.log("Connected to the employees database.")
);

connection.query = util.promisify(connection.query);



// Start the application after establishing connection
connection.connect(function (err) {

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




// Displays departments
function viewDepartments() {

    let query = 'SELECT * FROM `department`;'
    connection.query(query, function (err, res) {
    
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table(departmentArray);

        // Return to main questions
        initiate();
    })
};


