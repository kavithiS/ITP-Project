import express from 'express';
import multer from 'multer';
import { 
  getExpenses, 
  createExpense, 
  updateExpense, 
  deleteExpense 
} from '../controllers/expenseController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/receipts')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

router.get('/', getExpenses);
router.post('/', upload.single('receipt'), createExpense);
router.put('/:id', upload.single('receipt'), updateExpense);
router.delete('/:id', deleteExpense);

export default router;