import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import equipmentRoutes from './routes/equipmentRoutes.js';  
import purchases from './routes/purchases.js';// Change to .js extension

// Load environment variables
dotenv.config();

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// API Endpoints
app.use('/api/equipment', equipmentRoutes); 
app.use('/api/purchases',purchases);// Add /api prefix to match frontend URL

app.get('/', (req, res) => {
    res.send('API Working');
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));