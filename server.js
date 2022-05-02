
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
        console.log('Error connecting to the MySQL Database', err);
        return;
    }
    console.log('Connection established sucessfully');
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

            case "Update an employee":
                updateEmployee();
                break;

            case "Exit":
                console.log("Live long and prosper.")
                connection.end((error) => { });

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

    inquirer
        .prompt([
            {
                name: "dept_name",
                type: "input",
                message: "Enter new department title."
            }

        ])
        .then(function (answer) {

            // Connect to Deparment Table
            let query = "INSERT INTO Department (dept_name) VALUES ?"
            let values = [
                [answer.dept_name]
            ]
            connection.query(query, [values], (err, res) => {
                if (res) {
                    console.log('')
                    console.log('========= DEPARTMENT ADDED =========')
                    console.log('')

                    // restart employee tracker
                    initiate()
                } else if (err) {
                    console.log(err)
                }

            })
        })

};



// Function allows user to add a new role
function addRole() {

    // Get all Departments Query 
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
                .then(function (answer) {
                    // Push department ids
                    let department_ids = []
                    res.forEach(dept => {
                        department_ids.push(dept.department_ids)
                    })

                    // set department id for user selected answer
                    for (let i = 0; i <= department_ids.length; i++) {
                        answer.department_id = department_ids[i++]
                    }

                    // update roles table
                    let query = "INSERT INTO Roles (dept_title, salary, department_id) VALUES ?"
                    let values = [
                        [answer.dept_title, answer.salary, answer.department_id]
                    ]
                    connection.query(query, [values], (err, res) => {
                        if (res) {
                            console.log('')
                            console.log('========= ROLE ADDED =========')
                            console.log('')
                            initiate()
                        } else if (err) {
                            console.log(err)
                        }

                    })
                })

        } else if (err) {
            console.log('connection failed')
        }
    })

};



// Function allows user to add a new employee
function addEmployee() {

    // get all from roles table
    let query = 'SELECT * FROM `Roles`;'
    connection.query(query, (err, res) => {
        if (res) {
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "Enter employee's first name."
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "Enter employee's last name."
                    },
                    {
                        name: "role_id",
                        type: "rawlist",
                        choices: function () {
                            let roleArr = []
                            res.forEach(role => {
                                roleArr.push(role.dept_title)
                            });
                            return roleArr;
                        },
                        message: "Select role.",

                    },
                    {
                        name: "manager_id",
                        type: "list",
                        choices: ["Yes", "No"],
                        message: "Is this employee a manager?",
                    }
                ])
                .then(function (answer) {

                    // set user answers to correct mysql table input type
                    if (answer.manager_id.includes("Yes")) {
                        answer.manager_id = 6;
                    } else {
                        answer.manager_id = 4
                    };

                    // check if role table id and user selection role id matches
                    res.forEach(role => {
                        if (answer.role_id === role.dept_title) {
                            answer.role_id = role.id
                        }
                    })
                    // insert into employee table
                    let query = "INSERT INTO Employee (first_name, last_name, role_id, manager_id) VALUES ?"
                    let values = [
                        [answer.first_name, answer.last_name, answer.role_id, answer.manager_id]
                    ]
                    connection.query(query, [values], (err, res) => {
                        if (res) {
                            console.log('')
                            console.log('========= Employee ADDED =========')
                            console.log('')
                            initiate()
                        } else if (err) {
                            console.log(err)
                        }

                    })
                })

        } else if (err) {
            console.log('connection failed')
        }
    })

};




// Function updates an employee
function updateEmployee() {
console.log('entered update emp')
    // get everything from employee table 
    connection.query("SELECT * FROM `Employee`",
        function (err, res) {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        name: "employee_name",
                        type: "rawlist",
                        choices: function () {
                            let empArr = []
                            res.forEach(emp => {
                                empArr.push(emp.first_name + " " + emp.last_name)
                            });
                            return empArr;
                        },
                        message: "Select employee to edit."
                    }
                ])
                .then(function (answer) {

                    // split employee first and last name
                    const selectedEmployee = answer.employee_name;  // firstName lastName
                    let splitEmployee = selectedEmployee.split(' ') // ['firstName', 'lastName']
                    let selected_emp_first_name = splitEmployee[0]  // 'firstName'
                    let selected_emp_last_name = splitEmployee[1]   // 'lastName'

                    res.forEach(emp => {
                        if ((emp.first_name === selected_emp_first_name) && (emp.last_name === selected_emp_last_name)) {

                            // Prompt for Updated Employee info
                            let query = 'SELECT * FROM `Roles`;'
                            connection.query(query, (err, res) => {
                                if (res) {
                                    inquirer
                                        .prompt([
                                            {
                                                name: "first_name",
                                                type: "input",
                                                message: "Update employee's first name."
                                            },
                                            {
                                                name: "last_name",
                                                type: "input",
                                                message: "Update employee's last name."
                                            },
                                            {
                                                name: "role_id",
                                                type: "rawlist",
                                                choices: function () {
                                                    let roleArr = []
                                                    res.forEach(role => {
                                                        roleArr.push(role.dept_title)
                                                    });
                                                    return roleArr;
                                                },
                                                message: "Select role.",

                                            },
                                            {
                                                name: "manager_id",
                                                type: "list",
                                                choices: ["Yes", "No"],
                                                message: "Is this employee a manager?",
                                            }
                                        ])
                                        .then(function (answer) {

                                            // set is manager
                                            if (answer.manager_id.includes("Yes")) {
                                                answer.manager_id = 6;
                                            } else {
                                                answer.manager_id = 4
                                            };

                                            // check if ids match
                                            res.forEach(role => {
                                                if (answer.role_id === role.dept_title) {
                                                    answer.role_id = role.id
                                                }
                                            })
                                            // update employees with updated info
                                            let query = "UPDATE employee SET ? WHERE last_name = ?"
                                            let values = [
                                                {
                                                    first_name: answer.first_name,
                                                    last_name: answer.last_name,
                                                    role_id: answer.role_id,
                                                    manager_id: answer.manager_id
                                                }, selected_emp_last_name
                                            ]

                                            connection.query(query, values, (err, res) => {
                                                if (res) {
                                                    console.log('')
                                                    console.log('========= Employee Updated =========')
                                                    console.log('')
                                                    initiate()
                                                } else if (err) {
                                                    console.log(err)
                                                }

                                            })
                                        })

                                } else if (err) {
                                    console.log('connection failed')
                                }
                            })


                        }
                    });
                })
        }
    )
};