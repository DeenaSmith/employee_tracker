
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
    if (error) {
        console.log('Error connecting to the MySQL Database');
        return;
    }
    console.log('Connection established sucessfully');
    initiate();
});
//   connection.end((error) => {
//   });




// Initial prompt
function initiate() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View departments", "View roles", "View employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
            name: "initiate"
        }
    ]).then(function (res) {
        switch (res.initiate) {
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


// Catch-all for displaying selected data
function viewTables(tableQuery) {
    let query = tableQuery
    connection.query(query, (err, res) => {
        if (res) {
            let tableArray = [];
            res.forEach(table => tableArray.push(table));
            console.table(tableArray);

            // Return to main questions
            initiate();
        } else if (err) {
            console.log(err)
            return;
        }
    })

};


// Displays departments
function viewDepartments() {
    let query = 'SELECT * FROM `Department`;'
    viewTables(query)
};


// Display roles
function viewRoles() {
    let query = 'SELECT * FROM `Roles`;'
    viewTables(query)
};


// Display employees
function viewEmployees() {
    let query = 'SELECT * FROM `Employee`;'
    viewTables(query)
};



// Function allows user to add a new department
function addDepartment() {
    let query = 'SELECT * FROM `Department`;'
    connection.query(query, (err, res) => {
        if (res) {

            inquirer
                .prompt([
                    {
                        name: "dept_name",
                        type: "input",
                        message: "Enter new department title."
                    }

                ])
                .then(function(answer){

                        let query = "INSERT INTO Department (dept_name) VALUES ?"
                        let values  = [
                            [answer.dept_name]
                        ]
                        connection.query(query, [values], (err, res) => {
                            if(res){
                                console.log('')
                                console.log('========= DEPARTMENT ADDED =========')
                                console.log('')
                                initiate()
                            }else if(err){
                                console.log(err)
                            }

                        })
                })

        } else if (err) {
            console.log('connection failed')
        }
    })

};



// Function allows user to add a new role
function addRole() {
    let query = 'SELECT * FROM `Department`;'
    connection.query(query, (err, res) => {
        if (res) {

            inquirer
                .prompt([
                    {
                        name: "dept_title",
                        type: "input",
                        message: "Enter role title"
                    },
                    {
                        name: "salary",
                        type: "number",
                        message: "Enter salary",
                        validate: function (value) {
                            if (isNaN(value) === false) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: "department_id",
                        type: "rawlist",
                        choices: function () {
                            let deptArr = []
                            res.forEach(dept => {
                                deptArr.push(dept.dept_name)
                            });
                            return deptArr;
                        },
                        message: "Select department",

                    }
                ])
                .then(function(answer){
                    
                        if (answer.department_id.includes('Medical')) {
                            answer.department_id = 1;
                        } else if (answer.department_id.includes('Engineering')) {
                            answer.department_id = 2
                        } else if (answer.department_id.includes('Flight Operations')) {
                            answer.department_id = 3
                        } else if (answer.department_id.includes('Command')) {
                            answer.department_id = 4
                        } else if (answer.department_id.includes('Security')) {
                            answer.department_id = 5
                        }

                        let query = "INSERT INTO Roles (dept_title, salary, department_id) VALUES ?"
                        let values  = [
                            [answer.dept_title, answer.salary, answer.department_id]
                        ]
                        connection.query(query, [values], (err, res) => {
                            if(res){
                                console.log('')
                                console.log('========= ROLE ADDED =========')
                                console.log('')
                                initiate()
                            }else if(err){
                                console.log(err)
                            }

                        })
                })

        } else if (err) {
            console.log('connection failed')
        }
    })

};



function addEmployee() {

};