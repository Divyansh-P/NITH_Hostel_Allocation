require('dotenv');
const express = require('express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

const home = require('./routes/home');
// const user = require('./routes/user');

app.use("/api/v1", home);
app.use("/api/v1/user", home);
// app.use("/api/v1",user);
module.exports = app;