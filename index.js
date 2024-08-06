const express = require('express');

const app = express();

const { readFile } = require('fs').promises;

// app.get('/', (request, response) => {

//     readFile('./home.html', 'utf8', (err, html) => {

//         if (err) {
//             response.status(500).send('sorry, out of luck buddy');
//         }

//         response.send(html);
//     })
// })

app.get('/', async (request, response) => {

    response.send( await readFile('./html', utf8) );
    
})

app.listen(process.env.PORT || 3000, () => console.log('App available on http://localhost:3000'));