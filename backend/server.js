import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser'
import equipmentRoutes from './routes/equipmentRoutes.js';  
import purchases from './routes/purchases.js';// Change to .js extension
import router from './routes/index.routes.js';

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
app.use('/api/equipment', equipmentRoutes); 
app.use('/api/purchases',purchases);// Add /api prefix to match frontend URL
app.use("/api/user",router)

app.get('/', (req, res) => {
    res.send('API Working');
});

// Start Server
app.listen(port, () => console.log(`Server running on port ${port}`));