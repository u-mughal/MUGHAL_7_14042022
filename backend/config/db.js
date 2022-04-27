const mysql = require('mysql');
require('dotenv').config();


const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     :  process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database : 'groupomania',
});

db.connect((err) => {
    if (err) {
        return console.error('error connecting: ' + err.stack);
    }
    console.log('Mysql connected');  
});

module.exports.getDB = () => {
    return db
}