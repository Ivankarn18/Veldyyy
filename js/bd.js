// server.js
const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'yourusername',
    password: 'yourpassword',
    database: 'yourdbname'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected');
});

app.get('/data', (req, res) => {
    connection.query('SELECT * FROM your_table_name', (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});