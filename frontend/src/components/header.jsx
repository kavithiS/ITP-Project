import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "../assets/images/logo.png";
import ExpenseReport from "../components/ExpenseReport";
import Sidebar from "../components/Sidebar";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.headers.post["Content-Type"] = "application/json";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [totalBudget, setTotalBudget] = useState(() => {
    const savedBudget = localStorage.getItem("totalBudget");
    return savedBudget ? parseFloat(savedBudget) : 100000;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "material",
    date: new Date().toISOString().substr(0, 10),
    description: "",
    paymentMethod: "cash",
    projectId: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [projectBudgets, setProjectBudgets] = useState(() => {
    const savedBudgets = localStorage.getItem('projectBudgets');
    return savedBudgets ? JSON.parse(savedBudgets) : {};
  });

  const inputClassName =
    "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("/api/expenses");
        if (response.data) {
          setExpenses(
            Array.isArray(response.data)
              ? response.data
              : response.data.expenses || []
          );
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load expenses");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("/api/projects");
        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    if (name === 'projectId') {
      setFormData(prev => ({
        ...prev,
        projectId: value
      }));
    } else {
      setNewBudget(value);
    }
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    if (!formData.projectId || !newBudget || isNaN(newBudget)) {
      return;
    }

    const parsedBudget = parseFloat(newBudget);
    setProjectBudgets(prev => {
      const updated = {
        ...prev,
        [formData.projectId]: parsedBudget
      };
      localStorage.setItem('projectBudgets', JSON.stringify(updated));
      return updated;
    });

    setIsModalOpen(false);
    setNewBudget("");
    setFormData(prev => ({ ...prev, projectId: "" }));
    setSuccessMessage("Project budget allocated successfully!");
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  const filteredExpenses = expenses.filter((expense) => {
    if (!searchQuery) return true; // Show all when no search term
    
    const searchTerm = searchQuery.toLowerCase();
    return (
      expense.title.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm) ||
      expense.amount.toString().includes(searchTerm) ||
      new Date(expense.date).toLocaleDateString().includes(searchTerm)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Expenses Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white font-bold text-xl">
                J
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">Pasan Kalhara</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
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
              {loading && (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-6">
                  Loading...
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Expenses History
                    </h2>
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="text-xl font-semibold">
                      Total: ${totalExpenses.toFixed(2)}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Title
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Amount
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Category
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Date
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Project
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Payment Method
                          </th>
                          <th className="pb-4 font-semibold text-sm text-gray-600">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              Loading expenses...
                            </td>
                          </tr>
                        ) : filteredExpenses.length === 0 ? (
                          <tr>
                            <td
                              colSpan="7"
                              className="text-center py-4 text-gray-500"
                            >
                              {searchQuery
                                ? "No matching expenses found"
                                : "No expenses found"}
                            </td>
                          </tr>
                        ) : (
                          filteredExpenses.map((expense) => {
                            const project = projects.find(
                              (p) => p._id === expense.projectId
                            );
                            return (
                              <tr
                                key={expense._id}
                                className="border-b border-gray-100"
                              >
                                <td className="py-4">{expense.title}</td>
                                <td className="py-4">
                                  ${parseFloat(expense.amount).toFixed(2)}
                                </td>
                                <td className="py-4">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs capitalize
              ${expense.category === "material"
                                        ? "bg-blue-100 text-blue-800"
                                        : expense.category === "labor"
                                          ? "bg-green-100 text-green-800"
                                          : expense.category === "equipment"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : expense.category === "transport"
                                              ? "bg-purple-100 text-purple-800"
                                              : expense.category === "utilities"
                                                ? "bg-orange-100 text-orange-800"
                                                : "bg-gray-100 text-gray-800"
                                      }`}
                                  >
                                    {expense.category}
                                  </span>
                                </td>
                                <td className="py-4">
                                  {new Date(expense.date).toLocaleDateString()}
                                </td>
                                <td className="py-4">
                                  {project ? project.name : "Unknown Project"}
                                </td>
                                <td className="py-4 capitalize">
                                  {expense.paymentMethod}
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
                                    Remove
                                  </button>
                                  <button
                                    onClick={() => {
                                      const project = projects.find(
                                        (p) => p._id === expense.projectId
                                      );
                                      setSelectedExpense({
                                        ...expense,
                                        projectName: project?.name || "Unknown Project",
                                      });
                                    }}
                                    className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Project Budgets</h2>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-all"
                  >
                    Allocate Budget
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {projects.map(project => {
                    const projectExpenses = expenses.filter(e => e.projectId === project._id)
                      .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
                    const projectBudget = projectBudgets[project._id] || 0;
                    const remaining = projectBudget - projectExpenses;

                    return (
                      <div key={project._id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-lg">{project.name}</h3>
                          <span className="text-sm text-gray-500">Project ID: {project._id}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Allocated Budget</p>
                            <p className="text-xl font-bold text-gray-800">
                              ${projectBudget.toFixed(2)}
                            </p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Spent</p>
                            <p className="text-xl font-bold text-gray-800">
                              ${projectExpenses.toFixed(2)}
                            </p>
                          </div>
                          <div className={`p-3 rounded-lg ${remaining >= 0 ? 'bg-yellow-50' : 'bg-red-50'}`}>
                            <p className="text-sm text-gray-500">Remaining</p>
                            <p className={`text-xl font-bold ${remaining >= 0 ? 'text-gray-800' : 'text-red-600'}`}>
                              ${remaining.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-[600px]">
                    <h3 className="text-lg font-bold mb-4">Allocate Project Budget</h3>
                    <form onSubmit={handleBudgetSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Project
                        </label>
                        <select
                          name="projectId"
                          value={formData.projectId}
                          onChange={handleBudgetChange}
                          className={inputClassName}
                          required
                        >
                          <option value="">Select a project</option>
                          {projects.map((project) => (
                            <option key={project._id} value={project._id}>
                              {project.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Budget Amount (USD)
                        </label>
                        <input
                          type="number"
                          value={newBudget}
                          onChange={(e) => setNewBudget(e.target.value)}
                          className={inputClassName}
                          min="0"
                          step="0.01"
                          required
                          placeholder="Enter budget amount"
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
                          Allocate Budget
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-800">
                  Add New Expense
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Form fields */}
                </form>
              </div>
            </div>
          </div>
        </div>
        {selectedExpense && (
          <ExpenseReport
            expense={selectedExpense}
            totalBudget={totalBudget}
            projects={projects}
            onClose={() => setSelectedExpense(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
