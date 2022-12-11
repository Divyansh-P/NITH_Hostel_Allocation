require('dotenv').config();
const app = require('./app');
const {
    connect
} = require('./config/database');

// connect with database
connect();

const PORT = 8000;
console.log(PORT);
app.listen(PORT, () => console.log("server is listening" + PORT));