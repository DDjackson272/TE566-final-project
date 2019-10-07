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

app.get("/", function(req, res) {
    res.render("main");
});

app.get("/add/employee", function(req, res) {
    res.render("addEmployee");
});

app.get("/add/customer", function(req, res){
    res.render("addCustomer");
});

app.get("/add/vendor", function(req, res){
    res.render("addVendor");
});

app.get("/list/employee", function(req, res){
    let selectAll = 'select * from Employee;';
    db.query(selectAll, function(err, result){
       if (err) {
           return res.status(400).json({
               message: err.message
           });
       } else {
           res.render('listEmployee', {allEmployee: result});
       }
    });
});

app.get("/list/customer", function(req, res){
    let selectAll = 'select * from Customer;';
    db.query(selectAll, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            res.render('listCustomer', {allCustomer: result});
        }
    });
});

app.get("/list/vendor", function(req, res){
    let selectAll = 'select * from Vendor;';
    db.query(selectAll, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            res.render('listVendor', {allVendor: result});
        }
    });
});

app.post("/api/employee", function(req, res) {
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
       } else {
           res.redirect("/list/employee");
       }
    });
});

app.post("/api/customer", function(req, res){
   let customerRecord = {
       CompanyName: req.body.CompanyName,
       LastName: req.body.LastName,
       FirstName: req.body.FirstName,
       Address1: req.body.Address1,
       Address2: req.body.Address2,
       City: req.body.City,
       State: req.body.State,
       ZipCode: req.body.ZipCode,
       Price: req.body.Price
   };

   db.query('insert into Customer set ?', customerRecord, function(err){
       if (err) {
           return res.status(400).json({
               message:err.message
           })
       } else {
           res.redirect("/list/customer")
       }
   })
});

app.post("/api/vendor", function(req, res){
    let vendorRecord = {
        CompanyName: req.body.CompanyName,
        Part: req.body.Part,
        PricePerUnit: req.body.PricePerUnit,
        Address1: req.body.Address1,
        Address2: req.body.Address2,
        City: req.body.City,
        State: req.body.State,
        Zip: req.body.Zip
    };

    db.query('insert into Vendor set ?', vendorRecord, function(err){
        if (err) {
            return res.status(400).json({
                message:err.message
            })
        } else {
            res.redirect("/list/vendor")
        }
    })
});

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`)
});