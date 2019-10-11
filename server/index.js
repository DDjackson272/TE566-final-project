const express = require('express');
const db = require("./models/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 81;

const app = express();

let TOTAL_INVENTORY = 1000;

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

app.get("/pay/employee", function(req, res){
    let selectName = 'select firstName, lastName from Employee;';

    db.query(selectName, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            res.render('payEmployee', {employeeNames: result});
        }
    });
});

// total Disbursement + withholding (sum of all sort of tax) = salary before tax
// total withholding = federal tax + state tax + social security tax + medicare
app.post("/pay/employee", function(req, res){
    let name = req.body.names;
    let firstName = name.split(" ")[0];
    let lastName = name.split(" ")[1];
    // get salary based on firstName and lastName
    let salaryQuery = `select Salary, WithHolding 
    from Employee where FirstName="${firstName}" AND LastName="${lastName}";`;

    db.query(salaryQuery, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            if (result.length === 0){
                res.redirect("/");
                return;
            }
            let salary = result[0].Salary;
            let withHolding = result[0].WithHolding;
            let payRollRecord = {
                EmployeeFirstName: firstName,
                EmployeeLastName: lastName,
                Disbursement: salary,
                WithholdingValue: withHolding
            };
            db.query('insert into Payroll set ?', payRollRecord, function(err){
                if (err) {
                    return res.status(400).json({
                        message:err.message
                    })
                } else {
                    res.redirect("/");
                }
            })
        }
    });
});

app.get('/payroll/employee', function(req, res){
    let selectPayroll = 'select EmployeeFirstName, EmployeeLastName, Disbursement, WithholdingValue,' +
        'DATE(DatePaid) as DatePaid from Payroll;';

    db.query(selectPayroll, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            res.render('payrollEmployee', {payrolls: result});
        }
    });
});

app.get("/create/invoice", function(req, res){
    let selectName = 'select CompanyName from Customer;';

    db.query(selectName, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            res.render('invoice', {customers: result, total: TOTAL_INVENTORY});
        }
    });
});

app.post("/create/invoice", function(req, res){
    let invoiceRecord = {
        CompanyName: req.body.names,
        Quantity: req.body.Units
    };

    db.query('insert into Invoice set ?', invoiceRecord, function(err){
        if (err) {
            return res.status(400).json({
                message:err.message
            });
        } else {
            TOTAL_INVENTORY -= req.body.Units;
            res.redirect("/");
        }
    })
});

app.get("/invoice/history", function(req, res){
    let query = "select CompanyName, Quantity, DATE(Date) as Date from Invoice;";

    db.query(query, function(err, result){
        if (err) {
            return res.status(400).json({
                message:err.message
            })
        } else {
            res.render('invoiceHistory', {invoices: result})
        }
    })
});

app.get('/balance/sheet', function(req, res){
    let query = 'select * from BalanceSheet;';

    db.query(query, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            let totalCurrentAssets = parseInt(result[0].Cash) + parseInt(result[0].AccountsReceivable)
                + parseInt(result[0].Inventory);
            let totalFixedAssets = parseInt(result[0].LandAndBuildings) + parseInt(result[0].Equipment)
                + parseInt(result[0].FurnitureAndFixture);
            let totalCurrentLiabilities = parseInt(result[0].AccountsPayable) + parseInt(result[0].NotesPayable)
                + parseInt(result[0].Accruals);
            let totalLongTermDebt = parseInt(result[0].Mortgage);
            let sheet = {
                Assets: {
                    Cash: result[0].Cash,
                    AccountsReceivable: result[0].AccountsReceivable,
                    Inventory: result[0].Inventory,
                    LandAndBuildings: result[0].LandAndBuildings,
                    Equipment: result[0].Equipment,
                    FurnitureAndFixture: result[0].FurnitureAndFixture
                }, LiabilitiesNetWorth: {
                    AccountsPayable: result[0].AccountsPayable,
                    NotesPayable: result[0].NotesPayable,
                    Accruals: result[0].Accruals,
                    Mortgage: result[0].Mortgage,
                }, Total: {
                    TotalCurrentAssets: totalCurrentAssets,
                    TotalFixedAssets: totalFixedAssets,
                    TotalAssets: totalCurrentAssets + totalFixedAssets,
                    TotalCurrentLiabilities: totalCurrentLiabilities,
                    TotalLongTermDebt: totalLongTermDebt,
                    TotalLiabilities: totalCurrentLiabilities + totalLongTermDebt,
                    NetWorth: totalCurrentAssets + totalFixedAssets - totalCurrentLiabilities - totalLongTermDebt
                }};
            console.log(sheet);
            res.render('balanceSheet', {sheet: sheet})
        }
    })
});

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`)
});