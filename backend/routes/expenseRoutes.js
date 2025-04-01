import express from 'express';
import multer from 'multer';
import path from 'path';
import Expense from '../models/Expense.js';
import { getExpenses, createExpense, updateExpense, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  })
});

router.get('/', getExpenses);
router.post('/', upload.single('receipt'), async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      amount: parseFloat(req.body.amount),
      receipt: req.file ? req.file.filename : null
    };

    const expense = await Expense.create(expenseData);
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message || 'Failed to create expense' 
    });
  }
});

router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);

export default router;