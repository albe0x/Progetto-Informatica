const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const authRoutes = require('./src/routes/authRoutes');
const chatRoutes = require('./src/routes/chatRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);


app.use((err, req, res, next) => {
    console.error(err);
    const status = err.statusCode || 500;
    const message = err.message || "Errore interno del server";
    res.status(status).json({ 
        error: message 
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});