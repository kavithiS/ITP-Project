import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/images/logo.png';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'material',
    date: new Date().toISOString().substr(0, 10),
    description: '',
    paymentMethod: 'cash',
    projectId: '',
    receipt: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [expensesRes, projectsRes] = await Promise.all([
          axios.get('/api/expenses'),
          axios.get('/api/projects')
        ]);
        setExpenses(expensesRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      receipt: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'receipt' && formData[key]) {
          data.append(key, formData[key]);
        } else if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      
      const response = await axios.post('/api/expenses', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setExpenses(prev => [...prev, response.data]);
      setSuccessMessage('Expense added successfully!');
      
      // Reset form
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
    } catch (err) {
      setError('Failed to add expense');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 3000);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

  return (
    <div className="flex h-screen bg-gray-50">
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
              {/* ... Your existing expenses table code ... */}
              </div>
            </div>

            {/* Budget Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Budget Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Total Budget</p>
                  <p className="text-2xl font-bold text-gray-800">$100,000.00</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Spent</p>
                  <p className="text-2xl font-bold text-gray-800">${totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Remaining</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${(100000 - totalExpenses).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Add Expense Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Add New Expense</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* ... Your existing form fields with updated styling ... */}
                {/* Example of a styled form field: */}
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

                {/* Add all your other form fields here with the same styling */}
                
                <div className="md:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;