const express = require('express');
const path = require('path');
const mysql = require('mysql');
const app = express();
const port = 3000;

const pageRoute = require("./routes/pageRoute");
app.use("/", pageRoute);

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

    // Combine queries to fetch both student and book details
    connection.query('SELECT * FROM student1 WHERE roll = ?', [rollNumber], (error1, studentResults, fields1) => {
        if (error1) throw error1;

        if (studentResults.length > 0) {
            const user = studentResults[0];

            // Query to fetch book details
            connection.query('SELECT * FROM book1 WHERE roll = ?', [rollNumber], (error2, bookResults, fields2) => {
                if (error2) throw error2;

                // Render the EJS template with both student and book details
                res.render('stu_main', { user, rows: bookResults });
            });
        } else {
            res.status(404).send('User not found');
        }
    });
});

// Route to handle issuing a book
app.post('/issueBook', (req, res) => {
    const rollNumber = req.body.rollNumber; // Retrieve roll number from the request body
    const bookId = req.body.book_id; // Retrieve book ID from the form

    // Check if the book with the provided ID exists
    connection.query('SELECT * FROM book1 WHERE id = ?', [bookId], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            // Book with the provided ID exists, so update the roll number
            connection.query('UPDATE book1 SET roll = ? WHERE id = ?', [rollNumber, bookId], (updateError, updateResults, updateFields) => {
                if (updateError) throw updateError;

                console.log(`Book ${bookId} issued to roll number ${rollNumber}`);
                res.redirect('/userDetails?rollNumber=' + rollNumber); // Redirect back to user details page
            });
        } else {
            // Book with the provided ID does not exist
            console.log(`Book with ID ${bookId} not found`);
            res.redirect('/userDetails?rollNumber=' + rollNumber); // Redirect back to user details page
        }
    });
});
// return book
app.post('/returnBook', (req, res) => {
    const rollNumber = req.body.rollNumber; // Retrieve roll number from the request body
    const bookId = req.body.book_id; // Retrieve book ID from the form
    const nuller = 0
    // Check if the book with the provided ID exists
    connection.query('SELECT * FROM book1 WHERE id = ?', [bookId], (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
            // Book with the provided ID exists, so update the roll number
            connection.query('UPDATE book1 SET roll = ? WHERE id = ?', [nuller, bookId], (updateError, updateResults, updateFields) => {
                if (updateError) throw updateError;

                console.log(`Book ${bookId} returned`);
                res.redirect('/userDetails?rollNumber=' + rollNumber); // Redirect back to user details page
            });
        } else {
            // Book with the provided ID does not exist
            console.log(`Book with ID ${bookId} not found`);
            res.redirect('/userDetails?rollNumber=' + rollNumber); // Redirect back to user details page
        }
    });
});

// Route to check if a book has been issued to a student
app.get('/checkIssue', (req, res) => {
    const rollNumber = req.query.rollNumber;
    const bookId = req.query.bookId;

    // Query to check if the book has been issued to the student
    connection.query('SELECT * FROM book1 WHERE roll = ? AND id = ?', [rollNumber, bookId], (error, results, fields) => {
        if (error) {
            console.error('Error checking book issue:', error);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results.length > 0) {
            // Book has been issued to the student
            res.json({ issued: true });
        } else {
            // Book has not been issued to the student
            res.json({ issued: false });
        }
    });
});

app.get('/book', (req, res) => {
    connection.query('SELECT * FROM book1', (error, results) => {
      if (error) throw error;
      res.render('book_list', { data: results });
    });
  });

let userData = {};

app.post('/login', (req, res) => {
    const rollNumber = req.body.rollNumber;
    const passWord = req.body.passWord;

    userData.rollNumber = rollNumber;
    userData.passWord = passWord;

    connection.query('SELECT * FROM book1', (error, results) => {

        if (passWord == 'abc'){
            res.render('book_list', { data: results });
        } else {
            res.status(404).send('User not found')
        }
    });
});

app.get('/IssueBook', (req, res) => {
    const rollNumber = userData.rollNumber
    const id = req.query.id

    connection.query('UPDATE book1 SET roll = ? WHERE id = ?', [rollNumber, id], (updateError, updateResults, updateFields) => {
        if (updateError) throw updateError;

        console.log(`Book ${id} issued to roll number ${rollNumber}`);
        res.redirect('/userDetails?rollNumber=' + rollNumber); // Redirect back to user details page
    });
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
