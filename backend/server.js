const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Important: only try connecting if MONGO_URI is set, else we skip for dummy local tests.
if (process.env.MONGO_URI && process.env.MONGO_URI !== 'your_mongodb_atlas_connection_string_here') {
    connectDB();
} else {
    console.warn('MongoDB URI not configured. DB connection skipped.');
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
