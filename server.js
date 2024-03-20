const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '6969',
    database: 'alms_db'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Serve static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));

// Route to handle user details submission
app.get('/userDetails', (req, res) => {
    const rollNumber = req.query.rollNumber;

    connection.query('SELECT * FROM student WHERE roll = ?', [rollNumber], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            const user = results[0];
            res.render(path.join(__dirname, 'views/stu_main'), { user });
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Route to serve stu_login.html
app.get('/stu_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/stu_login.html'));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
