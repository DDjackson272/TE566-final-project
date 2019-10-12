const express = require('express');
const db = require("./models/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 81;

const app = express();

function salaryAfterTax(salary) {
    const stateTaxRate = 0.0495;
    const ficaRate = 0.062;
    const medicareRate = [0.0145, 0.0235];
    const federalTaxTate = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];
    const annualIncome = salary * 12;
    let totalTax = 0.0;
    // stateTax
    totalTax += annualIncome * stateTaxRate / 12;

    // fica
    if (annualIncome <= 132900) {
        totalTax += annualIncome * ficaRate / 12;
    } else {
        totalTax += 132900 * ficaRate / 12;
    }

    // medicare
    if (annualIncome <= 200000) {
        totalTax += medicareRate[0] * annualIncome / 12;
    } else {
        totalTax += (medicareRate[0] * 200000 + medicareRate[1] * (annualIncome-200000))/12;
    }

    // federal
    if (annualIncome <= 9700){
        totalTax += federalTaxTate[0] * annualIncome/12;
    } else if (annualIncome <= 39475) {
        totalTax += (970 + federalTaxTate[1] * (annualIncome-9700))/12;
    } else if (annualIncome <= 84200) {
        totalTax += (4543 + federalTaxTate[2] * (annualIncome-39475))/12;
    } else if (annualIncome <= 160725) {
        totalTax += (14382.5 + federalTaxTate[3] * (annualIncome-84200))/12;
    } else if (annualIncome <= 204100) {
        totalTax += (32748.5 + federalTaxTate[4] * (annualIncome-160725))/12;
    } else if (annualIncome <= 510300) {
        totalTax += (46628.5 + federalTaxTate[5] * (annualIncome-204100))/12;
    } else {
        totalTax += (153798.5 + federalTaxTate[6] * (annualIncome-510300))/12;
    }

    return salary - totalTax;
}

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
            let salary = parseFloat(result[0].Salary);
            let disbursement = salaryAfterTax(salary);
            let payRollRecord = {
                EmployeeFirstName: firstName,
                EmployeeLastName: lastName,
                Disbursement: disbursement,
                WithholdingValue: salary - disbursement
            };

            // first deduct the before tax salary from BalanceSheet.Cash
            // then insert the record into table Payroll
            // then update payroll record to table IncomeStatement
            db.query(`update BalanceSheet set Cash = Cash - ${salary};`, function(error){
                if (error) {
                    return res.status(400).json({
                        message:error.message
                    });
                } else {
                    db.query('insert into Payroll set ?', payRollRecord, function(err){
                        if (err) {
                            return res.status(400).json({
                                message:err.message
                            })
                        } else {
                            db.query(`update IncomeStatement set Payrolls = Payrolls + ${disbursement}, 
                            PayrollWithholding = PayrollWithholding + ${salary-disbursement};`, function(e){
                                if (e) {
                                    return res.status(400).json({
                                        message: e.message
                                    })
                                } else {
                                    res.redirect("/");
                                }
                            });
                        }
                    })
                }
            });
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
    let selectCompletedUnits = 'select CompleteUnits from inventorySell;';

    db.query(selectName, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            db.query(selectCompletedUnits, function(e, unitResult){
                if (e) {
                    return res.status(400).json({
                        message: e.message
                    })
                } else {
                    res.render('invoice', {customers: result, total: unitResult[0].CompleteUnits});
                }
            });
        }
    });
});

// update BalanceSheet.AccountsReceivable, IncomeStatement.Sales and IncomeStatement.COGs
// and, of course, InventorySell.CompleteUnits and InventorySell.TotalValue,
// finally, insert the created record into table Invoice, hell!
app.post("/create/invoice", function(req, res){
    let companyName = req.body.names;
    let quantity = parseFloat(req.body.Units);

    // get the price from customer
    db.query(`select Price from Customer where CompanyName="${companyName}"`, function(error, priceResult){
        if (error) {
            return res.status(400).json({
                message: error.message
            })
        } else {
            let price = parseFloat(priceResult[0].Price);
            let sales = price * quantity;
            // update BalanceSheet.AccountsReceivable
            db.query(`update BalanceSheet set AccountsReceivable=AccountsReceivable+${sales};`, function(err){
                if (err){
                    return res.status(400).json({
                        message: err.message
                    })
                } else {
                    // get COG from table InventorySell
                    db.query('select TotalValue/CompleteUnits as COG from InventorySell;', function(e, cost){
                        if (e) {
                            return res.status(400).json({
                                message: e.message
                            })
                        } else {
                            let cog = cost[0].COG;
                            let invoiceRecord = {
                                CompanyName: companyName,
                                Quantity: quantity,
                                PricePerUnit: price,
                                TotalValue: sales
                            };
                            // update InventorySell.CompleteUnits and InventorySell.TotalValue
                            db.query(`update InventorySell set TotalValue=TotalValue-${cog}*${quantity}, 
                            CompleteUnits=CompleteUnits-${quantity};`, function(e){
                                if(e) {
                                    return res.status(400).json({
                                        message: e.message
                                    })
                                }
                            });
                            // update IncomeStatement.Sales and IncomeStatement.COGs
                            db.query(`update IncomeStatement set Sales=Sales+${sales}, 
                            CostOfGoods=CostOfGoods+${cog}*${quantity};`, function(e){
                                if (e) {
                                    return res.status(400).json({
                                        message: e.message
                                    })
                                }
                            });
                            // finally update the table Invoice
                            db.query(`insert into Invoice set ?`, invoiceRecord, function(e){
                                if (e) {
                                    return res.status(400).json({
                                        message: e.message
                                    })
                                } else {
                                    return res.redirect("/");
                                }
                            })
                        }
                    });
                }
            })
        }
    })
});

app.get("/invoice/history", function(req, res){
    let query = "select CompanyName, Quantity, DATE(Date) as Date, PricePerUnit, TotalValue from Invoice;";

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
            let totalCurrentAssets = parseFloat(result[0].Cash) + parseFloat(result[0].AccountsReceivable)
                + parseFloat(result[0].Inventory);
            let totalFixedAssets = parseFloat(result[0].LandAndBuildings) + parseFloat(result[0].Equipment)
                + parseFloat(result[0].FurnitureAndFixture);
            let totalCurrentLiabilities = parseFloat(result[0].AccountsPayable) + parseFloat(result[0].NotesPayable)
                + parseFloat(result[0].Accruals);
            let totalLongTermDebt = parseFloat(result[0].Mortgage);
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
            res.render('balanceSheet', {sheet: sheet})
        }
    })
});

app.get('/income/statement', function(req, res){
   let  query = 'select * from IncomeStatement;';

   db.query(query, function(err, result){
       if (err) {
           return res.status(400).json({
               message: err.message
           })
       } else {
           let sales = parseFloat(result[0].Sales);
           let cogs = parseFloat(result[0].CostOfGoods);
           let payrolls = parseFloat(result[0].Payrolls);
           let payrollWithholding = parseFloat(result[0].PayrollWithholding);
           let bills = parseFloat(result[0].Bills);
           let annualExpenses =  parseFloat(result[0].AnnualExpenses);
           let otherIncome = parseFloat(result[0].OtherIncome);
           let operatingIncome = (sales-cogs)-(payrolls + payrollWithholding + bills + annualExpenses);
           let incomeTaxes = 0.0495 * operatingIncome;
           let statement = {
               Sales: {
                   "Sales": sales,
                   "COGs": cogs,
                   "Gross Profit": sales-cogs
               }, Expenses: {
                   "Payroll": payrolls,
                   "Payroll Withholding": payrollWithholding,
                   "Bills": bills,
                   "Annual Expenses": annualExpenses,
                   "Total Expenses": payrolls + payrollWithholding + bills + annualExpenses
               }, Other: {
                   "Other Income": otherIncome,
                   "Operating Income": operatingIncome,
                   "Income Taxes": incomeTaxes,
                   "Net Income": operatingIncome-incomeTaxes
               }
           };
           return res.render('incomeStatement.ejs', {statement: statement});
       }
   })
});

app.get('/inventory', function(req, res){
    let buyQuery = 'select * from InventoryBuy;';
    let sellQuery = 'select * from InventorySell;';

    db.query(buyQuery, function(err, buyResult){
        if (err) {
            return res.status(400).json({
                message: err.message
            });
        } else {
            db.query(sellQuery, function(e, sellResult){
                if (e) {
                    return res.status(400).json({
                        message: e.message
                    })
                } else {
                    return res.render('listInventory', {inventoryBuy: buyResult, inventorySell: sellResult})
                }
            });
        }
    })
});

app.get('/create/purchase', function(req, res){
   let getParts = 'select * from InventoryBuy;';

   db.query(getParts, function(err, result){
       if (err) {
           return res.status(400).json({
               message: err.message
           })
       } else {
           return res.render('createPurchase', {parts: result})
       }
   })
});

// update BalanceSheet.AccountsPayable and BalanceSheet.Inventory
// update IncomeStatement.Bills
// insert record into table PurchaseOrder
app.post('/create/purchase', function(req, res){
    let part = req.body.Part;
    let quantity = parseFloat(req.body.Quantity);

    // first get PricePerUnit from InventoryBuy
    db.query(`select PricePerUnit from InventoryBuy where Part="${part}";`, function(err, costResult){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            let costPerUnit = parseFloat(costResult[0].PricePerUnit);
            let payableBills = quantity * costPerUnit;
            let poRecord = {
                Part: part,
                Quantity: quantity,
                PricePerPart: costPerUnit,
                TotalValue: payableBills
            };

            // then update BalanceSheet first
            db.query(`update BalanceSheet set AccountsPayable=AccountsPayable+${payableBills}, 
            Inventory=Inventory+${payableBills};`, function(err){
                if (err) {
                    return res.status(400).json({
                        message: err.message
                    })
                }
            });

            // update IncomeStatement
            db.query(`update IncomeStatement set Bills=Bills+${payableBills};`, function(err){
                if(err) {
                    return res.status(400).json({
                        message: err.message
                    })
                }
            });

            // finally insert record into table PurchaseOrder
            db.query(`insert into PurchaseOrder set ?`, poRecord, function(err){
                if (err) {
                    return res.status(400).json({
                        message: err.message
                    })
                } else {
                    return res.redirect("/");
                }
            })
        }
    })
});

app.get('/purchase/history', function(req, res){
    let historyQuery = "select * from PurchaseOrder;";

    db.query(historyQuery, function(err, result){
        if (err) {
            return res.status(400).json({
                message: err.message
            })
        } else {
            res.render('purchaseHistory', {histories: result});
        }
    })
});

app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`)
});