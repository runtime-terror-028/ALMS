# ALMS
Automated Library Management System

Here is the structure of Mysql database:

database name => "ALMS_DB"

table1 name => "STUDENT":
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| roll        | int          | NO   | PRI | NULL    |       |
| f_name      | varchar(255) | NO   |     | NULL    |       |
| l_name      | varchar(255) | NO   |     | NULL    |       |
| course      | varchar(255) | NO   |     | NULL    |       |
| batch       | varchar(255) | YES  |     | NULL    |       |
| profile_pic | mediumblob   | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+

table2 name => "book":
+-------------+--------------+------+-----+---------+-------+
| Field       | Type         | Null | Key | Default | Extra |
+-------------+--------------+------+-----+---------+-------+
| id          | bigint       | NO   |     | NULL    |       |
| book_name   | varchar(225) | NO   |     | NULL    |       |
| book_author | varchar(225) | NO   |     | NULL    |       |
| roll        | int          | YES  |     | NULL    |       |
+-------------+--------------+------+-----+---------+-------+

Address:
/stu_login  --  for student login
/rep -- for admin login