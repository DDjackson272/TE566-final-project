const express = require('express');
const db = require("./models/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 81;

const app = express();

app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Welcome to TE566 Computer Program");
});

app.post("/employee", function(req, res) {
    let employeeRecord = {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Address1: req.body.Address1,
        Address2: req.body.Address2,
        City: req.body.City,
        State: req.body.State,
        ZipCode: req.body.ZipCode,
        SSN: req.body.SSN,
        WithHolding: req.body.WithHolding,
        Salary: req.body.Salary
    };

    db.query('insert into Employee set ?', employeeRecord, function(err){
       if (err) {
           return res.status(400).json({
               message: err.message
           })
       }
    });

    return res.status(200).json({
        message: "data inserted successfully"
    })
});

app.get("/employee", function(req, res){
    let selectAllEmployee = "select * from Employee;";
    db.query(selectAllEmployee, function (err, results){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            return res.status(200).json(results);
        }
    });
});

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`)
});