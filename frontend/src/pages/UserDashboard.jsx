import React, { useState } from 'react';
import { FiUsers, FiTruck, FiBox, FiBarChart2, FiCalendar, FiCheckSquare } from 'react-icons/fi';

const UserDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Project Manager', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Site Engineer', status: 'Active' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com', role: 'Contractor', status: 'Inactive' },
    { id: 4, name: 'Emily Davis', email: 'emily@example.com', role: 'Administrator', status: 'Active' },
    { id: 5, name: 'Michael Wilson', email: 'michael@example.com', role: 'Foreman', status: 'Active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: 'Active' });

  const filteredUsers = users.filter(user => 
    [user.name, user.email, user.role].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setNewUser(user ? { ...user } : { name: '', email: '', role: '', status: 'Active' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsers(prevUsers => 
      editingUser 
        ? prevUsers.map(user => user.id === editingUser.id ? { ...newUser, id: user.id } : user)
        : [...prevUsers, { ...newUser, id: prevUsers.length + 1 }]
    );
    handleCloseModal();
  };

  const stats = [
    { id: 1, name: 'Active Projects', value: '12', icon: FiBox, change: '+2.5%', changeType: 'increase' },
    { id: 2, name: 'Total Workers', value: '48', icon: FiUsers, change: '+3.7%', changeType: 'increase' },
    { id: 3, name: 'Equipment', value: '156', icon: FiTruck, change: '+1.2%', changeType: 'increase' },
    { id: 4, name: 'Tasks Completed', value: '89%', icon: FiCheckSquare, change: '+4.1%', changeType: 'increase' },
  ];

  const recentProjects = [
    { id: 1, name: 'City Center Mall', progress: 75, status: 'In Progress' },
    { id: 2, name: 'Metro Station', progress: 45, status: 'In Progress' },
    { id: 3, name: 'Office Complex', progress: 90, status: 'Near Completion' },
    { id: 4, name: 'Residential Tower', progress: 30, status: 'Early Stage' },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Site Inspection', date: '2024-03-31', priority: 'High' },
    { id: 2, title: 'Team Meeting', date: '2024-04-01', priority: 'Medium' },
    { id: 3, title: 'Equipment Maintenance', date: '2024-04-02', priority: 'Low' },
    { id: 4, title: 'Progress Review', date: '2024-04-03', priority: 'High' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, John</h1>
          <p className="mt-2 text-gray-600">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.id} className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Progress and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Projects</h2>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div key={project.id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{project.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Near Completion' ? 'bg-green-100 text-green-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">{project.progress}% Complete</div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h2>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      task.priority === 'High' ? 'bg-red-500' :
                      task.priority === 'Medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        <FiCalendar className="inline-block mr-1" />
                        {new Date(task.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-800' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-red-700">User Management</h2>
            <button onClick={() => handleOpenModal()} className="bg-red-500 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium shadow-md">
              + Add User
            </button>
          </div>

          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 shadow-sm"
          />

          <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-md">
            <thead className="bg-red-300">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Actions'].map(header => (
                  <th key={header} className="px-6 py-3 text-sm font-semibold text-red-900">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-red-100 transition">
                    <td className="px-6 py-4 text-gray-800 font-medium">{user.name}</td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{user.role}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-300 text-green-900' : 'bg-red-300 text-red-900'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenModal(user)} className="text-blue-700 hover:text-blue-900 mr-3">Edit</button>
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-700 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-700">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <input
                    type="text"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    {editingUser ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
