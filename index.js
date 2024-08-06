const express = require('express');

const app = express();

const { readFile } = require('fs').promises;

app.get('/', async (request, response) => {

    response.send( await readFile('./index.html', 'utf8') );

})

app.get('/renter', async (request, response) => {

    response.send( await readFile('./renter.html', 'utf8') );

})

app.get('/landlord', async (request, response) => {

    response.send( await readFile('./landlord.html', 'utf8') );

})

app.get('/signup', async (request, response) => {

    response.send( await readFile('./signup.html', 'utf8') );

})

app.get('/renterSignup', async (request, response) => {

    response.send( await readFile('./renterSignup.html', 'utf8') );

})

app.get('/landlordSignup', async (request, response) => {

    response.send( await readFile('./landlordSignup.html', 'utf8') );

})

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));