import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import logo from '../assets/images/logo.png';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editingMachine, setEditingMachine] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const API_URL = 'http://localhost:4000/api/equipment';

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setMachines(response.data);
      } catch (error) {
        setErrorMessage('Failed to load equipment. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
  };

  const handleRemoveMachine = async (id) => {
    if (window.confirm('Are you sure you want to remove this equipment?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/${id}`);
        setMachines((prevMachines) => prevMachines.filter((machine) => machine._id !== id));
        setSuccessMessage('Equipment removed successfully!');
      } catch (error) {
        setErrorMessage('Failed to remove equipment. Please try again.');
      } finally {
        setLoading(false);
        setTimeout(() => {
          setSuccessMessage('');
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingMachine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (machine) => {
    setEditingMachine({ ...machine });
    setShowEditModal(true);
  };

  const handleUpdateMachine = async (e) => {
    e.preventDefault();

    // Date validation for rental equipment
    if (editingMachine.status === 'Rented') {
      if (!validateDates(editingMachine.rentalStart, editingMachine.rentalEnd)) {
        setErrorMessage('Rental end date must be after the start date');
        return;
      }
    } else {
      if (editingMachine.lastMaintenanceDate && editingMachine.purchaseDate) {
        if (!validateDates(editingMachine.purchaseDate, editingMachine.lastMaintenanceDate)) {
          setErrorMessage('Maintenance date cannot be before purchase date');
          return;
        }
      }
    }

    try {
      setLoading(true);

      const formattedData = {
        ...editingMachine,
        purchaseDate: editingMachine.purchaseDate
          ? new Date(editingMachine.purchaseDate).toISOString()
          : null,
        lastMaintenanceDate: editingMachine.lastMaintenanceDate
          ? new Date(editingMachine.lastMaintenanceDate).toISOString()
          : null,
        rentalStart: editingMachine.rentalStart
          ? new Date(editingMachine.rentalStart).toISOString()
          : null,
        rentalEnd: editingMachine.rentalEnd
          ? new Date(editingMachine.rentalEnd).toISOString()
          : null,
      };

      const response = await axios.put(`${API_URL}/${editingMachine._id}`, formattedData);

      setMachines((prevMachines) =>
        prevMachines.map((machine) =>
          machine._id === editingMachine._id ? response.data : machine
        )
      );

      setSuccessMessage('Equipment updated successfully!');
      setShowEditModal(false);
      setEditingMachine(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to update equipment');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccessMessage('');
        setErrorMessage('');
      }, 3000);
    }
  };

  const downloadPDF = () => {
    if (!filteredMachines || filteredMachines.length === 0) {
      setErrorMessage('No data available to download');
      return;
    }

    try {
      // Create PDF document
      const doc = new jsPDF('landscape');
      
      // Add logo
      // Assuming logo is imported at the top of the file
      // If you want to add the logo, you'll need to convert it to base64 or use a URL
      // doc.addImage(logo, 'PNG', 15, 10, 20, 20);
      
      // Add title with some spacing
      doc.setFontSize(16);
      doc.text('Construction Equipment Inventory Report', 15, 20);
      
      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 30);

      // Prepare table data with proper null checks
      const tableData = filteredMachines.map(machine => [
        machine.name || 'N/A',
        machine.type || 'N/A',
        machine.status || 'N/A',
        machine.location || 'N/A',
        machine.status === 'Stocked' 
          ? `Purchase: ${machine.purchaseDate ? new Date(machine.purchaseDate).toLocaleDateString() : 'N/A'}` 
          : `Rental: ${machine.rentalStart ? new Date(machine.rentalStart).toLocaleDateString() : 'N/A'}`
      ]);

      // Generate table with specific styling
      doc.autoTable({
        head: [['Equipment Name', 'Type', 'Status', 'Location', 'Date']],
        body: tableData,
        startY: 40,
        theme: 'grid',
        styles: {
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
          cellWidth: 'wrap'
        },
        headStyles: {
          fillColor: [220, 53, 69], // RedBrick red color
          textColor: 255,
          fontSize: 8,
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 40 },
          2: { cellWidth: 30 },
          3: { cellWidth: 40 },
          4: { cellWidth: 50 }
        },
        margin: { top: 40, left: 10, right: 10 }
      });

      // Save PDF with a formatted filename
      const fileName = `equipment-inventory-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      setSuccessMessage('PDF downloaded successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('PDF generation error:', error);
      setErrorMessage(`Failed to generate PDF: ${error.message}`);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const inputClassName =
    'w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all';

  const filteredMachines = machines
    .filter((machine) => {
      // First apply status filter
      if (filter !== 'All' && machine.status !== filter) return false;
      
      // Then apply search filter
      const searchLower = searchQuery.toLowerCase();
      return machine.name.toLowerCase().includes(searchLower) ||
             (machine.location && machine.location.toLowerCase().includes(searchLower));
    });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed h-full w-64 bg-white border-r border-gray-200 shadow-lg">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10">
            <motion.img src={logo} alt="REDBRICK Logo" className="w-10 h-10 object-contain" />
            <span className="text-red-600 text-xl font-bold">RedBrick</span>
          </div>

          <div className="space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home</span>
            </Link>

            <Link
              to="/task"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Tasks</span>
            </Link>
            <Link
              to="/purchase"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span>Purchase</span>
            </Link>
            <Link
              to="/machineInventory"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <span>Machinery Inventory</span>
            </Link>
            <Link
              to="/inventory"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <span>Site Diary</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-50">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">Construction Equipment Inventory</h1>
              <div className="flex gap-3">
                <button
                  onClick={downloadPDF}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-all shadow-sm flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => navigate('/add-machine')}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add New Equipment
                </button>
              </div>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                {errorMessage}
              </div>
            )}

            {/* Inventory List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Equipment Inventory</h2>
                <div className="flex gap-3 items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name or location..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`${inputClassName} min-w-[300px] pl-10`}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="relative">
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className={`${inputClassName} appearance-none pr-10`}
                    >
                      <option value="All">All Equipment</option>
                      <option value="Stocked">Company Owned</option>
                      <option value="Rented">Rental Equipment</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFilter('All');
                      setSearchQuery('');
                    }}
                    className="whitespace-nowrap px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredMachines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No equipment found. Add some equipment to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Equipment
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Type/Details
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Location
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Key Dates
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredMachines.map((machine) => (
                        <tr key={machine._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {machine.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {machine.manufacturer}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{machine.type}</div>
                            {machine.status === 'Stocked' ? (
                              <div className="text-sm text-gray-500">
                                SN: {machine.serialNumber || 'N/A'}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                Vendor: {machine.vendorName || 'N/A'}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                machine.status === 'Stocked'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {machine.status === 'Stocked'
                                ? 'Company Owned'
                                : 'Rental'}
                            </span>
                            <div className="mt-1">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  machine.condition === 'Excellent'
                                    ? 'bg-green-100 text-green-800'
                                    : machine.condition === 'Good'
                                    ? 'bg-green-100 text-green-800'
                                    : machine.condition === 'Fair'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : machine.condition === 'Poor'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {machine.condition}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {machine.location || 'N/A'}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {machine.status === 'Stocked' ? (
                              <>
                                <div>
                                  Purchased:{' '}
                                  {machine.purchaseDate
                                    ? new Date(machine.purchaseDate).toLocaleDateString()
                                    : 'N/A'}
                                </div>
                                <div>
                                  Last Maintenance:{' '}
                                  {machine.lastMaintenanceDate
                                    ? new Date(machine.lastMaintenanceDate).toLocaleDateString()
                                    : 'N/A'}
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  Start:{' '}
                                  {machine.rentalStart
                                    ? new Date(machine.rentalStart).toLocaleDateString()
                                    : 'N/A'}
                                </div>
                                <div>
                                  End:{' '}
                                  {machine.rentalEnd
                                    ? new Date(machine.rentalEnd).toLocaleDateString()
                                    : 'N/A'}
                                </div>
                                {machine.rentalCost && (
                                  <div className="font-medium">{machine.rentalCost}</div>
                                )}
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(machine)}
                                className="group relative bg-blue-500 px-4 py-2 rounded-xl text-white font-medium hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
                              >
                                Edit
                                <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                              </button>
                              <button
                                onClick={() => handleRemoveMachine(machine._id)}
                                className="group relative bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2 rounded-xl text-white font-medium hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-red-500/30 transform hover:scale-105"
                              >
                                Remove
                                <div className="absolute inset-0 bg-white rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Edit Equipment</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdateMachine} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editingMachine?.name || ''}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <input
                  type="text"
                  name="type"
                  value={editingMachine?.type || ''}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={editingMachine?.manufacturer || ''}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={editingMachine?.status || 'Stocked'}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                >
                  <option value="Stocked">Company Owned</option>
                  <option value="Rented">Rental Equipment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  name="condition"
                  value={editingMachine?.condition || 'Good'}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={editingMachine?.location || ''}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                />
              </div>

              {editingMachine?.status === 'Stocked' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                    <input
                      type="text"
                      name="serialNumber"
                      value={editingMachine?.serialNumber || ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={editingMachine?.purchaseDate ? editingMachine.purchaseDate.split('T')[0] : ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Maintenance Date</label>
                    <input
                      type="date"
                      name="lastMaintenanceDate"
                      value={editingMachine?.lastMaintenanceDate ? editingMachine.lastMaintenanceDate.split('T')[0] : ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={editingMachine?.vendorName || ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Contact</label>
                    <input
                      type="text"
                      name="vendorContact"
                      value={editingMachine?.vendorContact || ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Start Date</label>
                    <input
                      type="date"
                      name="rentalStart"
                      value={editingMachine?.rentalStart ? editingMachine.rentalStart.split('T')[0] : ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental End Date</label>
                    <input
                      type="date"
                      name="rentalEnd"
                      value={editingMachine?.rentalEnd ? editingMachine.rentalEnd.split('T')[0] : ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Cost</label>
                    <input
                      type="text"
                      name="rentalCost"
                      value={editingMachine?.rentalCost || ''}
                      onChange={handleEditInputChange}
                      className={inputClassName}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={editingMachine?.notes || ''}
                  onChange={handleEditInputChange}
                  className={inputClassName}
                  rows="3"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;