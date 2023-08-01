// const express = require('express');
// // import express from 'express';
// const mysql = require('mysql');

// const app = express();
// const port = 3000; // Change this to your desired port

// // Database connection configuration
// const connection = mysql.createConnection({
//   host: '164.52.212.196',
//   user: 'iailDataMining',
//   password: 'CUWDUY@xjhjh8971',
//   database: 'qubes',
// });

// // Connect to MySQL
// connection.connect((err) => {
//     if (err) {
//       console.error('Error connecting to MySQL:', err);
//       return;
//     }
//     console.log('Connected to MySQL database.');
//   });
  
//   // Define a route to fetch data from the MySQL database
//   app.get('/get-data', (req, res) => {
//     const query = 'SELECT * FROM File;'; // Replace your_table_name with your actual table name
  
//     connection.query(query, (err, rows) => {
//       if (err) {
//         console.error('Error executing MySQL query:', err);
//         res.status(500).json({ error: 'Error executing MySQL query.' });
//         return;
//       }
//       console.log(rows);
//       res.json(rows);
//     });
//   });
//   // Start the server
//   app.listen(port, () => {
//     console.log(`Server started on port ${port}.`);
//   });