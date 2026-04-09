const express = require('express');
const app = express();

const db = require('./src/db');

app.get('/', (req, res) => {
  res.send('ciao sono il server api');
});


const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const messageRoutes = require('./src/routes/messageRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);



app.listen(3000, () => {
  console.log('Server running on port 3000');
});