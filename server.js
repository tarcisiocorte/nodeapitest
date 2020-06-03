const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbcon');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());

app.get('/', (req, res) => res.send('API feita para avaliação esta em execução'));

// Define Routes
app.use('/api/sign_up', require('./routes/api/usuarios'));
app.use('/api/sign_in', require('./routes/api/auth'));

app.use('/api/usuarios', require('./routes/api/usuarios'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
