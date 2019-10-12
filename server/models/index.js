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

// function to drop tables
function drop(table) {
    return `drop table if exists ${table};`;
}

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
    "Disbursement float(8)," +
    "WithholdingValue float(8)," +
    "DatePaid timestamp not null default current_timestamp," +
    "PRIMARY KEY (event_id)" +
    ");";

let invoices = "create table Invoice (" +
    "invoice_id int NOT NULL AUTO_INCREMENT," +
    "CompanyName varchar(255)," +
    "Quantity Float(8)," +
    "Date timestamp not null default current_timestamp," +
    "PricePerUnit Float(8)," +
    "TotalValue Float(8)," +
    "PRIMARY KEY (invoice_id)" +
    ");";

let balanceSheet = "create table BalanceSheet (" +
    "Cash Float(8)," +
    "AccountsReceivable Float(8)," +
    "Inventory Float(8)," +
    "LandAndBuildings Float(8)," +
    "Equipment Float(8)," +
    "FurnitureAndFixture Float(8)," +
    "AccountsPayable Float(8)," +
    "NotesPayable Float(8)," +
    "Accruals Float(8)," +
    "Mortgage Float(8)" +
    ");";

let incomeStatement = "create table IncomeStatement (" +
    "Sales Float(8)," +
    "CostOfGoods Float(8)," +
    "Payrolls Float(8)," +
    "PayrollWithholding Float(8)," +
    "Bills Float(8)," +
    "AnnualExpenses Float(8)," +
    "OtherIncome Float(8)" +
    ");";

let purchaseOrder = "create table PurchaseOrder (" +
    "PurchaseOrder_id int," +
    "PurchaseOrderDate timestamp not null default current_timestamp," +
    "Supplier varchar(255)," +
    "Part varchar(255)," +
    "Quantity Float(8)," +
    "PricePerPart Float(8)," +
    "TotalValue Float(8)," +
    "PRIMARY KEY (PurchaseOrder_id)" +
    ");";

let inventoryBuy = "create table InventoryBuy (" +
    "Part varchar(255)," +
    "PricePerUnit Float(8)," +
    "Quantity Float(8)," +
    "TotalValue Float(8)" +
    ");";

let inventorySell = "create table InventorySell (" +
    "CanBeBuildUnits Float(8)," +
    "CompleteUnits Float(8)," +
    "TotalValue Float(8)" +
    ");";

let nameTable = {
    Employee: employees,
    Customer: customers,
    Vendor: vendors,
    Payroll: payrollEvents,
    Invoice: invoices,
    BalanceSheet: balanceSheet,
    IncomeStatement: incomeStatement,
    PurchaseOrder: purchaseOrder,
    InventoryBuy: inventoryBuy,
    InventorySell: inventorySell
};

let dummyData = {
    Employee: [{
        FirstName: "Joe",
        LastName: "Doe",
        Address1: "123 Front Street",
        Address2: "Apt 111",
        City: "Urbana",
        State: "IL",
        ZipCode: "61801",
        SSN: "123-123-3231",
        WithHolding: 0,
        Salary: 12500
    }, {
        FirstName: "Enze",
        LastName: "Ding",
        Address1: "1010 E College St",
        Address2: "Room 352",
        City: "Champaign",
        State: "IL",
        ZipCode: "61820",
        SSN:"117-031-4312",
        WithHolding: 2,
        Salary: 11200
    }], BalanceSheet: [{
        Cash: 200000,
        AccountsReceivable: 0,
        Inventory: 26122.5,
        LandAndBuildings: 0,
        Equipment: 0,
        FurnitureAndFixture: 0,
        AccountsPayable: 0,
        NotesPayable: 0,
        Accruals: 0,
        Mortgage: 0
    }], IncomeStatement: [{
        Sales: 52412.5,
        CostOfGoods: 0,
        Payrolls: 0,
        PayrollWithholding: 0,
        Bills: 0,
        AnnualExpenses: 0,
        OtherIncome: 0
    }], InventorySell: [{
        CanBeBuildUnits: 750,
        CompleteUnits: 1000,
        TotalValue: 770,
    }], Customer: [{
        CompanyName: "Amazon Service Inc.",
        Address1: "300 Pine St",
        City: "Seattle",
        State: "WA",
        ZipCode: "98103",
        Price: 2.5
    }], Vendor: [{
        Part: "Axles",
        PricePerUnit: 0.01
    }, {
        Part: "Screw",
        PricePerUnit: 0.02
    }, {
        Part: "Cab Casting",
        PricePerUnit: 0.05
    }, {
        Part: "Rims",
        PricePerUnit: 0.01
    }, {
        Part: "Mixer",
        PricePerUnit: 0.05
    }, {
        Part: "Labor",
        PricePerUnit: 0.1
    }, {
        Part: "Tank",
        PricePerUnit: 0.1
    }, {
        Part: "Tires",
        PricePerUnit: 0.02
    }, {
        Part: "Master Pack",
        PricePerUnit: 0.02
    }, {
        Part: "Body Casting",
        PricePerUnit: 0.1
    }, {
        Part: "Windshield",
        PricePerUnit: 0.1
    }, {
        Part: "Box",
        PricePerUnit: 0.05
    }], InventoryBuy: [{
        Part: "Axles",
        PricePerUnit: 0.01,
        Quantity: 330000,
        TotalValue: 3300
    }, {
        Part: "Screw",
        PricePerUnit: 0.02,
        Quantity: 48250,
        TotalValue: 965
    }, {
        Part: "Cab Casting",
        PricePerUnit: 0.05,
        Quantity: 28250,
        TotalValue: 1412.5
    }, {
        Part: "Rims",
        PricePerUnit: 0.01,
        Quantity: 6000,
        TotalValue: 60
    }, {
        Part: "Mixer",
        PricePerUnit: 0.05,
        Quantity: 48250,
        TotalValue: 2412.5
    }, {
        Part: "Labor",
        PricePerUnit: 0.1,
        Quantity: 48250,
        TotalValue: 4825
    }, {
        Part: "Tires",
        PricePerUnit: 0.02,
        Quantity: 6000,
        TotalValue: 120
    }, {
        Part: "Master Pack",
        PricePerUnit: 0.02,
        Quantity: 48250,
        TotalValue: 965
    }, {
        Part: "Body Casting",
        PricePerUnit: 0.1,
        Quantity: 48250,
        TotalValue: 4825
    }, {
        Part: "Windshield",
        PricePerUnit: 0.1,
        Quantity: 48250,
        TotalValue: 4825
    }, {
        Part: "Box",
        PricePerUnit: 0.05,
        Quantity: 48250,
        TotalValue: 2412.5
    }]
};

// Initialize tables: delete the old ones and create new ones.
// At the mean time, insert dummy data into the newly created tables.
Object.keys(nameTable).forEach(function(name){
    connection.query(drop(name), function(err){
        if (err) {
            console.log(`Error when deleting table ${name}!`);
        } else {
            connection.query(nameTable[name], function(err){
                if (err) {
                    console.log(`Error when creating new table ${name}! ${err.message}`);
                } else {
                    if (name in dummyData){
                        dummyData[name].forEach(function(data){
                            connection.query(`insert into ${name} set ?`, data, function(err){
                                if (err) {
                                    console.log(`Error when inserting dummy data into ${name}! ${err.message}`)
                                }
                            })
                        });
                    }
                }
            })
        }
    })
});

module.exports = connection;