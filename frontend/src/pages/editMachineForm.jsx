import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const EditMachineForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isRentedForm, setIsRentedForm] = useState(false);
  const [machine, setMachine] = useState({
    name: '',
    type: '',
    manufacturer: '',
    serialNumber: '',
    status: 'Stocked',
    condition: 'Good',
    location: '',
    notes: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
    rentalStart: '',
    rentalEnd: '',
    vendorName: '',
    vendorContact: '',
    rentalCost: ''
  });

  useEffect(() => {
    const fetchMachine = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/equipment/${id}`);
        setMachine(response.data);
        setIsRentedForm(response.data.status === 'Rented');
      } catch (error) {
        setErrorMessage('Failed to load equipment details');
      } finally {
        setLoading(false);
      }
    };

    fetchMachine();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format dates before sending
      const formattedData = {
        ...machine,
        purchaseDate: machine.purchaseDate ? new Date(machine.purchaseDate).toISOString() : null,
        lastMaintenanceDate: machine.lastMaintenanceDate ? new Date(machine.lastMaintenanceDate).toISOString() : null,
        rentalStart: machine.rentalStart ? new Date(machine.rentalStart).toISOString() : null,
        rentalEnd: machine.rentalEnd ? new Date(machine.rentalEnd).toISOString() : null
      };

      await axios.put(`http://localhost:4000/api/equipment/${id}`, formattedData);
      setSuccessMessage('Equipment updated successfully!');
      setTimeout(() => {
        navigate('/machineInventory');
      }, 2000);
    } catch (error) {
      setErrorMessage('Failed to update equipment');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMachine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

  if (loading) return <div>Loading...</div>;
  if (!machine) return <div>Equipment not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Edit Equipment</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsRentedForm(false);
                  setMachine(prev => ({ ...prev, status: 'Stocked' }));
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
                type="button"
                onClick={() => {
                  setIsRentedForm(true);
                  setMachine(prev => ({ ...prev, status: 'Rented' }));
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

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Equipment Name *</label>
              <input
                type="text"
                name="name"
                value={machine.name}
                onChange={handleChange}
                className={inputClassName}
                required
              />
            </div>

            {/* Add all the same form fields as in addMachineForm.jsx */}
            {/* Just change the value and onChange props to use machine and handleChange */}

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
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMachineForm;

// In your backend router
router.put('/api/equipment/:id', async (req, res) => {
  try {
    const updatedMachine = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedMachine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});