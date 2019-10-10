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
    "Quantity int," +
    "Date timestamp not null default current_timestamp," +
    "PricePerUnit varchar(255)," +
    "TotalValue varchar(255)," +
    "PRIMARY KEY (invoice_id)" +
    ");";

let balanceSheet = "create table BalanceSheet (" +
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

let incomeStatement = "create table IncomeStatement (" +
    "Sales varchar(255)," +
    "CostOfGoods varchar(255)," +
    "Payrolls varchar(255)," +
    "PayrollWithholding varchar(255)," +
    "Bills varchar(255)," +
    "AnnualExpenses varchar(255)," +
    "OtherIncome varchar(255)" +
    ");";

let purchaseOrder = "create table PurchaseOrder (" +
    "PurchaseOrder_id int," +
    "PurchaseOrderDate timestamp not null default current_timestamp," +
    "Supplier varchar(255)," +
    "Part varchar(255)," +
    "Quantity varchar(255)," +
    "PricePerPart varchar(255)," +
    "TotalValue varchar(255)," +
    "PRIMARY KEY (PurchaseOrder_id)" +
    ");";

let inventoryBuy = "create table InventoryBuy (" +
    "Part varchar(255)," +
    "PricePerUnit varchar(255)," +
    "Quantity varchar(255)," +
    "TotalValue varchar(255)" +
    ");";

let inventorySell = "create table InventorySell (" +
    "CanBeBuildUnits varchar(255)," +
    "CompleteUnits varchar(255)," +
    "TotalValue varchar(255)" +
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

// Initialize tables: delete the old ones and create new ones.
Object.keys(nameTable).forEach(function(name){
    connection.query(drop(name), function(err){
        if (err) {
            console.log(`Error when deleting table ${name}!`);
        } else {
            connection.query(nameTable[name], function(err){
                if (err) {
                    console.log(`Error when creating new table ${name}!`);
                }
            })
        }
    })
});

// Add some dummy data in to tables

module.exports = connection;