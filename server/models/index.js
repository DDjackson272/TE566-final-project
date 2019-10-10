const mysql = require('mysql');

// Connect to local database
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "CS411!!!",
    database: "financial",
    port: "3306"
});

connection.connect(function(err){
    if(err) {
        console.log("Database not connected!");
        throw err;
    }
    console.log('Database connected!');
});

// first create table in case they do not exist
let employees = "create table Employee (" +
    "employee_id int NOT NULL AUTO_INCREMENT," +
    "FirstName varchar(255)," +
    "LastName varchar(255)," +
    "Address1 varchar(255)," +
    "Address2 varchar(255)," +
    "City varchar(255)," +
    "State varchar(255)," +
    "ZipCode varchar(255)," +
    "SSN varchar(255)," +
    "WithHolding float(8)," +
    "Salary float(8)," +
    "PRIMARY KEY (employee_id)"+
    ");";

let customers = "create table Customer (" +
    "customer_id int NOT NULL AUTO_INCREMENT," +
    "CompanyName varchar(255)," +
    "LastName varchar(255)," +
    "FirstName varchar(255)," +
    "Address1 varchar(255)," +
    "Address2 varchar(255)," +
    "City varchar(255)," +
    "State varchar(255)," +
    "ZipCode varchar(255)," +
    "Price float(8)," +
    "PRIMARY KEY (customer_id)" +
    ");";

let vendors = "create table Vendor (" +
    "vendor_id int NOT NULL AUTO_INCREMENT," +
    "CompanyName varchar(255)," +
    "Part varchar(255)," +
    "PricePerUnit float(8)," +
    "Address1 varchar(255)," +
    "Address2 varchar(255)," +
    "City varchar(255)," +
    "State varchar(255)," +
    "Zip varchar(255)," +
    "PRIMARY KEY (vendor_id)" +
    ");";

let payrollEvents = "create table Payroll (" +
    "event_id int NOT NULL AUTO_INCREMENT," +
    "EmployeeFirstName varchar(255)," +
    "EmployeeLastName varchar(255)," +
    "PaymentValue float(8)," +
    "WithholdingValue float(8)," +
    "DatePaid timestamp not null default current_timestamp," +
    "PRIMARY KEY (event_id)" +
    ");";

let invoices = "create table Invoice (" +
    "invoice_id int NOT NULL AUTO_INCREMENT," +
    "CompanyName varchar(255)," +
    "UnitNum int," +
    "Date timestamp not null default current_timestamp," +
    "PRIMARY KEY (invoice_id)" +
    ");";

let balanceSheet = "create table balance_sheet (" +
    "Cash varchar(255)," +
    "AccountsReceivable varchar(255)," +
    "Inventory varchar(255)," +
    "LandAndBuildings varchar(255)," +
    "Equipment varchar(255)," +
    "FurnitureAndFixture varchar(255)," +
    "AccountsPayable varchar(255)," +
    "NotesPayable varchar(255)," +
    "Accruals varchar(255)," +
    "Mortgage varchar(255)" +
    ");";

connection.query(employees, function(err){
    if(err){
        console.log(err.message);
    }
});

connection.query(customers, function(err){
    if(err){
        console.log(err.message);
    }
});

connection.query(vendors, function(err){
    if(err){
        console.log(err.message);
    }
});

connection.query(payrollEvents, function(err){
    if(err){
        console.log(err.message);
    }
});

connection.query(invoices, function(err){
   if(err){
       console.log(err.message);
   }
});

connection.query(balanceSheet, function(err){
    if(err){
        console.log(err.message)
    }
});

module.exports = connection;