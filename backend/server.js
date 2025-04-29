import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser'
import expenseRoutes from './routes/expenseRoutes.js';

dotenv.config()

const app = express()
app.use(cookieParser())
app.use(cors({
    origin: true,
    credentials: true,
}))

app.use(express.json({ limit: "10mb" })); 

const port = process.env.PORT || 4000;

connectDB();

// API Endpoints
app.use('/api/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('API Working');
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));