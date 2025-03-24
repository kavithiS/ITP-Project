import express from 'express';
import Purchase from '../models/Purchase.js';

const router = express.Router();

// Create new purchase order
router.post('/', async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();
    res.status(201).json({ message: 'Purchase order created successfully', purchase });
  } catch (error) {
    res.status(400).json({ message: 'Error creating purchase order', error: error.message });
  }
});

// Get all purchase orders
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find().sort({ createdAt: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchase orders', error: error.message });
  }
});

export default router;