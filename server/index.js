const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./App/routes/authRoutes');
const expenseRoutes = require('./App/routes/expenseRoutes');
const connectDB = require('./App/config/db');

const app = express();
dotenv.config();
connectDB();
app.use(express.json());

// app.use(cors());
app.use(cors({
  origin: "https://expense-tracker-seven-pi-82.vercel.app",  // ✅ your frontend URL
  credentials: true,  // ✅ if you’re using cookies or tokens
}));

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);


app.get('/', (req, res) => {
  res.send('welcome to expense tracker');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// http://localhost:5000/
