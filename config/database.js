const mongoose = require('mongoose');
require('dotenv').config()
const {
    DB_URL
} = process.env;
exports.connect = () => {
    mongoose.connect(DB_URL.toString(), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("database connected succesfully");
    }).catch((e) => {
        console.log("databse connection "+e);
    });
    mongoose.connection.on('connected', () => {
        console.log("MongoDb Connected");
    })
}