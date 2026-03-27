const express = require('express');
const app = express();

const db = require('./src/db');

app.get('/', (req, res) => {
  res.send('ciao sono il server api');
}); 





app.listen(3000, () => {
  console.log('Server running on port 3000');
});