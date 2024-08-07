const express = require('express');

const app = express();

const { readFile } = require('fs').promises;

const bodyParser = require('body-parser');
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./db/testing.db', (err) => {
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
app.get('/landlordsignin', async (request, response) => {

  response.send( await readFile('./src/static/landlordsignin.html', 'utf8') );

})
app.get('/rentersignin', async (request, response) => {

  response.send( await readFile('./src/static/renterssignin.html', 'utf8') );

})

app.get('/signinpage', async (request, response) => {

    response.send( await readFile('./src/static/signinpage.html', 'utf8') );

})


app.get('/listingform', async (request, response) => {

    response.send( await readFile('./src/static/listingform.html', 'utf8') );

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

  app.post('/listing_data', (req, res) => {
    const {listing_id, postcode, email, beds, bathrooms, smoker_allowed, children_allowed, pet_allowed, cost} = req.body;
  
    // SQL query to insert data into tennents table
    const sql = `
      INSERT INTO listings (listing_id, postcode, email, beds, bathrooms, smoker_allowed, children_allowed, pet_allowed, cost)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    const params = [listing_id, postcode, email, beds, bathrooms, smoker_allowed, children_allowed, pet_allowed, cost];
  
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
    
    

    app.post('/property_search', (req, res) => {
        const {
            postcode,
            range,
            beds,
            Min_cost,
            max_cost,
            utilities,
            pet_allowed,
            children_allowed,
            smoker_allowed
        } = req.body;
    
        let sql = `SELECT * FROM listings WHERE 1=1`; // Adding `WHERE 1=1` allows for easy appending of conditions
        let params = [];
        
        // Dynamically build SQL query and parameters
        if (postcode) {
            sql += ` AND postcode LIKE ?`;
            params.push(`%${postcode}%`);
        }
        if (Min_cost || Min_cost === 0) {
            sql += ` AND cost >= ?`;
            params.push(Min_cost);
        }
        if (max_cost || max_cost === 5000) {
            sql += ` AND cost <= ?`;
            params.push(max_cost);
        }
        if (beds || beds === 1) {
            sql += ` AND beds = ?`;
            params.push(beds);
        }
        if (req.body.bathrooms || req.body.bathrooms === 1) {
            sql += ` AND bathrooms = ?`;
            params.push(req.body.bathrooms);
        }
        if (utilities) {
            sql += ` AND utilities = 1`;
        }
        if (pet_allowed) {
            sql += ` AND pets_allowed = 1`;
        }
        if (children_allowed) {
            sql += ` AND children_allowed = 1`;
        }
        if (smoker_allowed) {
            sql += ` AND smoking_allowed = 1`;
        }
        
        // Execute the SQL query
        db.all(sql, params, (err, rows) => {
            if (err) {
                console.error('Error executing search query:', err.message);
                return res.status(500).send('Error 505 no collum. Return to homepage');
            }
            res.json(rows); // Or render a view with results
        });
      });
        // Define routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/landlord_signin', (req, res) => {
  const { email, password } = req.body;

  // SQL query to select the password for the given email
  const sql = 'SELECT password FROM landlords WHERE email = ?';
  db.get(sql, [email], (err, row) => {
      if (err) {
          console.error('Error executing the query:', err.message);
          return res.status(500).send('Internal server error.');
      }

      if (!row) {
          // If user is not found, send an unauthorized response
          return res.status(401).send('Invalid email or password.');
      }

      if (row.password === password) {
          // If the password matches, send a success response
          return res.send('Login successful!');
      } else {
          // If the password does not match, send an unauthorized response
          return res.status(401).send('Invalid email or password.');
      }
  });
});
  app.post('/renter_signin', (req, res) => {
    const { email, password } = req.body;
  
    // SQL query to select the password for the given email
    const sql = 'SELECT password FROM tennents WHERE email = ?';
    db.get(sql, [email], (err, row) => {
        if (err) {
            console.error('Error executing the query:', err.message);
            return res.status(500).send('Internal server error.');
        }
  
        if (!row) {
            // If user is not found, send an unauthorized response
            return res.status(401).send('Invalid email or password.');
        }
  
        if (row.password === password) {
            // If the password matches, send a success response
            return res.send('Login successful!');
        } else {
            // If the password does not match, send an unauthorized response
            return res.status(401).send('Invalid email or password.');
        }
    });
});




app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));

// db.close((err) => {
//     if (err) return console.error(err.message);
// })