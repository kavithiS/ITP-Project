import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import logo from '../assets/images/logo.png';

const AddMachineForm = () => {
  const navigate = useNavigate();
  const [isRentedForm, setIsRentedForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newMachine, setNewMachine] = useState({
    name: '',
    type: '',
    manufacturer: '',
    serialNumber: '',
    status: 'Stocked',
    condition: 'Good',
    location: '',
    notes: '',
    // Fields for owned machines
    purchaseDate: '',
    lastMaintenanceDate: '',
    // Fields for rented machines
    rentalStart: '',
    rentalEnd: '',
    vendorName: '',
    vendorContact: '',
    rentalCost: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMachine({
      ...newMachine,
      [name]: value
    });
  };

  const validateDates = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    return new Date(startDate) < new Date(endDate);
  };

  const handleAddMachine = async (e) => {
    e.preventDefault();
    
    // Date validation for rental equipment
    if (isRentedForm) {
      if (!validateDates(newMachine.rentalStart, newMachine.rentalEnd)) {
        setErrorMessage('Rental end date must be after the start date');
        return;
      }
    } else {
      // Date validation for company-owned equipment
      if (newMachine.lastMaintenanceDate && newMachine.purchaseDate) {
        if (!validateDates(newMachine.purchaseDate, newMachine.lastMaintenanceDate)) {
          setErrorMessage('Maintenance date cannot be before purchase date');
          return;
        }
      }
    }

    try {
      // Format dates to ISO string before sending to MongoDB
      const formattedData = {
        ...newMachine,
        status: isRentedForm ? 'Rented' : 'Stocked',
        // Convert dates to ISO strings
        purchaseDate: newMachine.purchaseDate ? new Date(newMachine.purchaseDate).toISOString() : null,
        lastMaintenanceDate: newMachine.lastMaintenanceDate ? new Date(newMachine.lastMaintenanceDate).toISOString() : null,
        rentalStart: newMachine.rentalStart ? new Date(newMachine.rentalStart).toISOString() : null,
        rentalEnd: newMachine.rentalEnd ? new Date(newMachine.rentalEnd).toISOString() : null
      };

      await axios.post('http://localhost:4000/api/equipment', formattedData);
      setSuccessMessage('Equipment added successfully!');
      navigate('/machineInventory');
    } catch (error) {
      setErrorMessage('Failed to add equipment. Please try again.');
      console.error('Error:', error);
    }
  };

  const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Logo */}
          <div className="flex items-center gap-3 mb-8">
            <motion.img src={logo} alt="REDBRICK Logo" className="w-10 h-10 object-contain" />
            <span className="text-red-600 text-xl font-bold">RedBrick</span>
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

          {/* Add New Equipment Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Add New Equipment</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsRentedForm(false);
                    setNewMachine({...newMachine, status: 'Stocked'});
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    !isRentedForm 
                    ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Company Owned
                </button>
                <button
                  onClick={() => {
                    setIsRentedForm(true);
                    setNewMachine({...newMachine, status: 'Rented'});
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    isRentedForm 
                    ? 'bg-red-600 text-white shadow-sm hover:bg-red-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rental Equipment
                </button>
              </div>
            </div>

            {/* Form content */}
            <form onSubmit={handleAddMachine} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newMachine.name}
                  onChange={handleInputChange}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <input
                  type="text"
                  name="type"
                  value={newMachine.type}
                  onChange={handleInputChange}
                  className={inputClassName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={newMachine.manufacturer}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Serial Number</label>
                <input
                  type="text"
                  name="serialNumber"
                  value={newMachine.serialNumber}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <input
                  type="text"
                  name="condition"
                  value={newMachine.condition}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={newMachine.location}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  name="notes"
                  value={newMachine.notes}
                  onChange={handleInputChange}
                  className={inputClassName}
                />
              </div>

              {/* Conditional fields */}
              {!isRentedForm ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={newMachine.purchaseDate}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Maintenance Date</label>
                    <input
                      type="date"
                      name="lastMaintenanceDate"
                      value={newMachine.lastMaintenanceDate}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Start Date</label>
                    <input
                      type="date"
                      name="rentalStart"
                      value={newMachine.rentalStart}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental End Date</label>
                    <input
                      type="date"
                      name="rentalEnd"
                      value={newMachine.rentalEnd}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      name="vendorName"
                      value={newMachine.vendorName}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Contact</label>
                    <input
                      type="text"
                      name="vendorContact"
                      value={newMachine.vendorContact}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rental Cost</label>
                    <input
                      type="text"
                      name="rentalCost"
                      value={newMachine.rentalCost}
                      onChange={handleInputChange}
                      className={inputClassName}
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 lg:col-span-3">
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/machineInventory')}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    Add Equipment
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMachineForm;