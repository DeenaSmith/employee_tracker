
// Requirements
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
require("dotenv").config();
const util = require('util');


// Ties DB to SQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
});


// Start the application after establishing connection
connection.connect((error) => {
    if(error){
      console.log('Error connecting to the MySQL Database');
      return;
    }
    console.log('Connection established sucessfully');
    initiate();
  });
  connection.end((error) => {
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

    let query = 'SELECT * FROM `Department`;'
    connection.query(query, function (err, res) {
        console.log('VIEW DEPARTMENTS RES', res)
        let departmentArray = [];
        res.forEach(department => departmentArray.push(department));
        console.table(departmentArray);

        // Return to main questions
        initiate();
    })
};



// Display roles
function viewRoles() {

    let query = 'SELECT * FROM `Roles`;'
    connection.query(query, function (err, res) {
      //  console.log(res, "RESPONSE");
    
        let rolesArray = [];
        res.forEach(role => rolesArray.push(role));
        console.table(rolesArray);

        // Return to main questions
        initiate();
    })
};


