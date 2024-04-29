const express = require ("express");
const router = express.Router();
const path = require('path');

router.get('/stu_login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/stu_login.html'));
});

router.get('/check', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/rep.html'));
});

// router.get('/book', (req, res) => {
//     res.sendFile(path.join(__dirname, '../views/book_list.html'));
// });

module.exports = router