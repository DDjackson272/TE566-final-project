const express = require('express');
const app = express();
const db = require("./models/index");
const PORT = 81;

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.status(200).json({
        first_name: "Hengzhe",
        last_name: "ding"
    });
});
app.listen(PORT, function () {
    console.log(`Server running on port: ${PORT}`)
});