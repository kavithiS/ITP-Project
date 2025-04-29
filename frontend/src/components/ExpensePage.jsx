import { useState, useEffect } from 'react';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    date: '',
    category: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/expenses');
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched expenses:', data); // Debug log
      setExpenses(data);
    } catch (error) {
      console.error('Fetching error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting expense:', newExpense); // Debug log

      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...newExpense,
          amount: parseFloat(newExpense.amount) // Ensure amount is a number
        })
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to add expense');
      }
      
      console.log('Server response:', responseData); // Debug log
      
      setExpenses(prevExpenses => [...prevExpenses, responseData]);
      setNewExpense({ 
        title: '', 
        amount: '', 
        date: '', 
        category: '', 
        description: '' 
      });
    } catch (error) {
      console.error('Error details:', error);
      alert('Failed to add expense: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  if (loading) return <div>Loading expenses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          name="title"
          value={newExpense.title}
          onChange={handleChange}
          placeholder="Expense Title"
          className="border p-2 mr-2"
          required
        />
        <input
          type="number"
          name="amount"
          value={newExpense.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="date"
          value={newExpense.date}
          onChange={handleChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="category"
          value={newExpense.category}
          onChange={handleChange}
          placeholder="Category"
          className="border p-2 mr-2"
          required
        />
        <textarea
          name="description"
          value={newExpense.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Expense
        </button>
      </form>

      <div className="mt-4">
        {expenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          expenses.map((expense) => (
            <div key={expense._id} className="border p-4 mb-2">
              <h3>{expense.title}</h3>
              <p>Amount: ${expense.amount}</p>
              <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
              <p>Category: {expense.category}</p>
              <p>Description: {expense.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ExpensePage;