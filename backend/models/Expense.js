import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['material', 'labor', 'equipment', 'transportation', 'utility', 'permit', 'other']
  },
  date: {
    type: Date,
    required: true
  },
  description: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'credit', 'debit', 'check', 'transfer'],
    default: 'cash'
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  receipt: String
}, {
  timestamps: true
});

export default mongoose.model('Expense', expenseSchema);