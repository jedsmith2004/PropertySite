const express = require('express');

const app = express();

const { readFile } = require('fs').promises;

const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./testing.db', (err) => {
    if (err) {
      console.error('Could not open database', err.message);
      process.exit(1);
    }
    console.log('Connected to the SQLite database.');
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('.'));

app.get('/', async (request, response) => {

    response.send( await readFile('./src/index.html', 'utf8') );

})

app.get('/renter', async (request, response) => {

    response.send( await readFile('./src/static/renter.html', 'utf8') );

})

app.get('/landlord', async (request, response) => {

    response.send( await readFile('./src/static/landlord.html', 'utf8') );

})

app.get('/signup', async (request, response) => {

    response.send( await readFile('./src/static/signup.html', 'utf8') );

})

app.get('/renterSignup', async (request, response) => {

    response.send( await readFile('./src/static/renterSignup.html', 'utf8') );

})

app.get('/landlordSignup', async (request, response) => {

    response.send( await readFile('./src/static/landlordSignup.html', 'utf8') );

})

app.post('/tenant', (req, res) => {
    const { name, email, phone_number, password, gender, smoker, number_of_pets, number_of_children, number_of_people, income } = req.body;
  
    const smokerValue = smoker ? 'Yes' : 'No'; // Checkbox will be undefined if not checked
  
    // SQL query to insert data into tennents table
    const sql = `
      INSERT INTO tennents (email, phone_number, password, gender, smoker, number_of_pets, number_of_children, number_of_tennents, income)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const params = [email, phone_number, password, gender, smokerValue, number_of_pets, number_of_children, number_of_people, income];
  
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error inserting data', err.message);
        res.status(500).send('Error inserting data into the database.');
        return;
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.redirect('/');
    });
  });

  app.post('/landlord_signup', (req, res) => {
    const { name, email, number, password, gender} = req.body;
  
    // SQL query to insert data into tennents table
    const sql = `
      INSERT INTO landlords (email, number, password, gender, name)
      VALUES (?, ?, ?, ?, ?)
    `;
  
    const params = [email, number, password, gender, name];
  
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error inserting data', err.message);
        res.status(500).send('Error inserting data into the database.');
        return;
      }
      console.log(`A row has been inserted with rowid ${this.lastID}`);
      res.redirect('/');
    });
  });

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));

// db.close((err) => {
//     if (err) return console.error(err.message);
// });