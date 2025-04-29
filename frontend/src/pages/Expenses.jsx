import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo.png';
import ExpenseReport from '../components/ExpenseReport';

// Configure axios
axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.headers.post['Content-Type'] = 'application/json';

const ExpensesPage = () => {
  // State declarations
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [totalBudget, setTotalBudget] = useState(() => {
    const savedBudget = localStorage.getItem('totalBudget');
    return savedBudget ? parseFloat(savedBudget) : 100000;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState('');
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  
  // Form state with default values
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'material',
    date: new Date().toISOString().substr(0, 10),
    description: '',
    paymentMethod: 'cash',
    projectId: '',
    receipt: null  // Add this line
  });

  // Fetch expenses data
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('/api/expenses');
        if (response.data) {
          setExpenses(Array.isArray(response.data) ? response.data : response.data.expenses || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load expenses');
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: 'material',
      date: new Date().toISOString().substr(0, 10),
      description: '',
      paymentMethod: 'cash',
      projectId: '',
      receipt: null
    });
    setIsEditing(false);
    setEditingExpense(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const expenseData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        projectId: formData.projectId,
        description: formData.description
      };

      const response = await axios.post('/api/expenses', expenseData);

      if (response.data) {
        const newExpense = response.data.data || response.data;
        setExpenses(prev => [...prev, newExpense]);
        setSuccessMessage('Expense added successfully!');
        resetForm();
      }
    } catch (err) {
      console.error('Error creating expense:', err);
      setError(err.response?.data?.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: new Date(expense.date).toISOString().substr(0, 10),
      description: expense.description || '',
      paymentMethod: expense.paymentMethod,
      projectId: expense.projectId
    });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingExpense?._id) return;

    try {
      setLoading(true);
      setError(null);

      const expenseData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        paymentMethod: formData.paymentMethod,
        projectId: formData.projectId,
        description: formData.description
      };

      const response = await axios.put(`/api/expenses/${editingExpense._id}`, expenseData);

      if (response.data) {
        setExpenses(prev => 
          prev.map(exp => exp._id === editingExpense._id ? response.data.data || response.data : exp)
        );
        setSuccessMessage('Expense updated successfully!');
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    } // Added missing closing brace

    try {
      setLoading(true);
      setError(null);

      await axios.delete(`/api/expenses/${id}`);
      setExpenses(prev => prev.filter(expense => expense._id !== id));
      setSuccessMessage('Expense deleted successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  }; // Added missing semicolon

  const handleBudgetChange = (e) => {
    setNewBudget(e.target.value);
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (newBudget && !isNaN(newBudget)) {
      const parsedBudget = parseFloat(newBudget);
      setTotalBudget(parsedBudget);
      localStorage.setItem('totalBudget', parsedBudget.toString());
      setIsModalOpen(false);
      setNewBudget('');
      setSuccessMessage('Budget updated successfully!');
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
  const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Expenses Management</h1>
        
        {/* Status Messages */}
        {loading && (
          <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
            Loading...
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            {successMessage}
          </div>
        )}

        {/* Sidebar */}
        <nav className="fixed h-full w-64 bg-white border-r border-gray-200 shadow-lg">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-10">
              <img 
                src={logo} 
                alt="REDBRICK Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-red-600 text-xl font-bold">RedBrick</span>
            </div>

            <div className="space-y-1">
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
              
              {/* Add other sidebar links similar to machineInventory.jsx */}
              {/* ... Add your other navigation links here ... */}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex-1 ml-64 bg-gray-50">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-gray-800 mb-8">Expenses Management</h1>

              {/* Messages */}
              {successMessage && (
                <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                  {successMessage}
                </div>
              )}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                  {error}
                </div>
              )}

              {/* Expenses List */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Expenses History</h2>
                    <div className="text-xl font-semibold">
                      Total: ${totalExpenses.toFixed(2)}
                    </div>
                  </div>

                {/* Expenses Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="pb-4 font-semibold text-sm text-gray-600">Title</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Amount</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Category</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Date</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Project</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Payment Method</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Description</th>
                        <th className="pb-4 font-semibold text-sm text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
  {loading ? (
    <tr>
      <td colSpan="8" className="text-center py-4">Loading expenses...</td>
    </tr>
  ) : expenses.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center py-4 text-gray-500">No expenses found</td>
    </tr>
  ) : (
    expenses.map((expense) => (
      <tr key={expense._id} className="border-b border-gray-100">
        <td className="py-4">{expense.title}</td>
        <td className="py-4">${parseFloat(expense.amount).toFixed(2)}</td>
        <td className="py-4">
          <span className={`px-2 py-1 rounded-full text-xs capitalize
            ${expense.category === 'material' ? 'bg-blue-100 text-blue-800' :
            expense.category === 'labor' ? 'bg-green-100 text-green-800' :
            expense.category === 'equipment' ? 'bg-yellow-100 text-yellow-800' :
            expense.category === 'transport' ? 'bg-purple-100 text-purple-800' :
            expense.category === 'utilities' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'}`}>
            {expense.category}
          </span>
        </td>
        <td className="py-4">{new Date(expense.date).toLocaleDateString()}</td>
        <td className="py-4">{expense.projectId}</td>
        <td className="py-4 capitalize">{expense.paymentMethod}</td>
        <td className="py-4 truncate max-w-xs" title={expense.description}>
          {expense.description || '-'}
        </td>
        <td className="py-4">
          <button
            onClick={() => handleEdit(expense)}
            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(expense._id)}
            className="mr-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => setSelectedExpense(expense)}
            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            View Report
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
                  </table>
                </div>
                </div>
              </div>

              {/* Budget Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Budget Summary</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all"
                  >
                    Adjust Budget
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Budget</p>
                    <p className="text-2xl font-bold text-gray-800">${totalBudget.toFixed(2)}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Spent</p>
                    <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Remaining</p>
                    <p className="text-2xl font-bold text-gray-800">
                      ${(totalBudget - totalExpenses).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Budget Adjustment Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-96">
                    <h3 className="text-lg font-bold mb-4">Adjust Total Budget</h3>
                    <form onSubmit={handleBudgetSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Budget Amount (USD)
                        </label>
                        <input
                          type="number"
                          value={newBudget}
                          onChange={handleBudgetChange}
                          className={inputClassName}
                          min="0"
                          step="0.01"
                          required
                          placeholder="Enter new budget amount"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsModalOpen(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                        >
                          Update Budget
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Add Expense Form */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">{isEditing ? 'Edit Expense' : 'Add New Expense'}</h2>
                
                <form onSubmit={isEditing ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Expense Title*
      </label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        className={inputClassName}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Amount (USD)*
      </label>
      <input
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleInputChange}
        className={inputClassName}
        min="0"
        step="0.01"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category*
      </label>
      <select
        name="category"
        value={formData.category}
        onChange={handleInputChange}
        className={inputClassName}
        required
      >
        <option value="material">Material</option>
        <option value="labor">Labor</option>
        <option value="equipment">Equipment</option>
        <option value="transport">Transport</option>
        <option value="utilities">Utilities</option>
        <option value="other">Other</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Date*
      </label>
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleInputChange}
        className={inputClassName}
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Payment Method*
      </label>
      <select
        name="paymentMethod"
        value={formData.paymentMethod}
        onChange={handleInputChange}
        className={inputClassName}
        required
      >
        <option value="cash">Cash</option>
        <option value="credit">Credit Card</option>
        <option value="debit">Debit Card</option>
        <option value="check">Check</option>
        <option value="transfer">Bank Transfer</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Project Name*
      </label>
      <input
        type="text"
        name="projectId"
        value={formData.projectId}
        onChange={handleInputChange}
        className={inputClassName}
        placeholder="Enter project name"
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className={inputClassName}
        rows="3"
      />
    </div>

    <div className="md:col-span-2 lg:col-span-3">
      <button
        type="submit"
        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm disabled:bg-red-300"
        disabled={loading}
      >
        {loading ? 'Processing...' : isEditing ? 'Update Expense' : 'Add Expense'}
      </button>
    </div>
  </form>
              </div>
            </div>
          </div>
        </div>
        {/* Add this before the closing div of your main content */}
        {selectedExpense && (
          <ExpenseReport
            expense={selectedExpense}
            totalBudget={totalBudget}
            onClose={() => setSelectedExpense(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;