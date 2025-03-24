import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const inputClassName = "w-full px-4 py-2 rounded-lg border-2 border-red-200 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all";

const TaskManager = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <nav className="fixed h-full w-64 bg-white border-r border-gray-200 shadow-lg">
             <div className="p-6">
               <div className="flex items-center gap-3 mb-10">
                 <motion.img 
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
                 
                 <Link 
                   to="/task" 
                   className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                   </svg>
                   <span>Tasks</span>
                 </Link>
                 <Link 
                   to="/purchase" 
                   className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                   </svg>
                   <span>Purchase</span>
                 </Link>
                 <Link 
                   to="/machineInventory" 
                   className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                   </svg>
                   <span>Machinery Inventory</span>
                 </Link>
                 <Link 
                   to="/inventory" 
                   className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-600 transition-all"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                   </svg>
                   <span>Site Diary</span>
                 </Link>
               </div>
             </div>
           </nav>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Task Manager</h1>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Task Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                  <select 
                    className={inputClassName}
                    onChange={() => setIsOpen(!isOpen)}
                  >
                    <option value="">Select type...</option>
                    <option value="1">Excavation</option>
                    <option value="2">Footing concrete</option>
                    <option value="3">Column</option>
                    <option value="4">Beam</option>
                    <option value="5">Slab</option>
                    <option value="6">Masonary</option>
                    <option value="7">Plastering</option>
                  </select>
                </div>

                {/* Floor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <select 
                    className={inputClassName}
                  >
                    <option value="">Select floor...</option>
                    <option value="0">Ground Floor</option>
                    <option value="1">First Floor</option>
                    <option value="2">Second Floor</option>
                    <option value="3">Third Floor</option>
                    <option value="4">Fourth Floor</option>
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input 
                    type="number" 
                    min="0"
                    className={inputClassName}
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Dates */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input 
                    type="date"
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input 
                    type="date"
                    className={inputClassName}
                  />
                </div>

                {/* Site Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
                  <input 
                    type="text"
                    className={inputClassName}
                    placeholder="Enter location"
                  />
                </div>

                {/* Submit Button - Full Width */}
                <div className="col-span-full flex justify-end mt-4">
                  <button 
                    type="submit"
                    className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all shadow-sm"
                  >
                    Create Task
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

export default TaskManager;