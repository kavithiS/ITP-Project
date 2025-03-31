import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiUsers,
  FiTruck,
  FiBox,
  FiCheckSquare,
  FiCalendar,
  FiDownload,
  FiUpload,
} from "react-icons/fi";

const UserDashboard = () => {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "/signIn";
  }
  if (localStorage.getItem("userRole") !== "ADMIN") {
    window.location.href = "/";
  }
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    status: "Active",
  });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const [token, setToken] = useState(localStorage.getItem("authToken") || "");
  const fileInputRef = useRef(null);

  const API_URL = "http://localhost:4000/api/user";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formattedUsers = response.data.data.map((user) => ({
        _id: user._id,
        proPic: user.proPic,
        name: `${user.fName} ${user.lName}`,
        fName: user.fName,
        lName: user.lName,
        address: user.address,
        dob: user.dob,
        role: user.role,
        gender: user.gender,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        status: "Active",
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleTemplateDownload = () => {
    const headers =
      "fName,lName,email,role,gender,address,dob,createdAt,updatedAt,status\n";
    const exampleRow =
      "John,Doe,john.doe@example.com,Admin,Male,123 Main St,1990-01-01,2023-01-01,2023-01-01,Active\n";
    const csvContent = headers + exampleRow;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "import_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    setNewUser(
      user ? { ...user } : { name: "", email: "", role: "", status: "Active" }
    );
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`${API_URL}/user-details/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await axios.put(`${API_URL}/user-details/${editingUser._id}`, newUser, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/user-details/create`, {
          ...newUser,
          pwd: "defaultPassword123",
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (error) {
      console.error("Error submitting user:", error);
    }
  };

  const handleCsvImport = async () => {
    if (!fileInputRef.current.files[0]) {
      setImportError("Please select a CSV file");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const csvData = event.target.result;
        const lines = csvData.split("\n").slice(1);
        const newUsers = lines
          .filter((line) => line.trim())
          .map((line) => {
            const [
              fName,
              lName,
              email,
              role,
              gender,
              address,
              dob,
              createdAt,
              updatedAt,
              status,
            ] = line.split(",");
            return {
              fName: fName?.trim(),
              lName: lName?.trim(),
              email: email?.trim(),
              role: role?.trim(),
              gender: gender?.trim(),
              address: address?.trim(),
              dob: dob?.trim(),
              createdAt: createdAt?.trim(),
              updatedAt: updatedAt?.trim(),
              status: status?.trim() || "Active",
            };
          });

        await Promise.all(
          newUsers.map((user) =>
            axios.post(`${API_URL}/signup`, {
              ...user,
              password: "defaultPassword123",
            })
          )
        );

        fetchUsers();
        setIsImportModalOpen(false);
        alert("CSV import successful");
      } catch (error) {
        console.error("Error importing CSV:", error);
        setImportError("Failed to import CSV file.");
      }
    };
    reader.readAsText(fileInputRef.current.files[0]);
  };

  const handleCsvExport = () => {
    const headers =
      "fName,lName,email,role,gender,address,dob,createdAt,updatedAt,status\n";
    const csvContent =
      headers +
      users
        .map(
          (user) =>
            `${user.fName},${user.lName},${user.email},${user.role},${user.gender},${user.address},${user.dob},${user.createdAt},${user.updatedAt},${user.status}`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const stats = [
    {
      id: 1,
      name: "Active Projects",
      value: "12",
      icon: FiBox,
      change: "+2.5%",
      changeType: "increase",
    },
    {
      id: 2,
      name: "Total Workers",
      value: "48",
      icon: FiUsers,
      change: "+3.7%",
      changeType: "increase",
    },
    {
      id: 3,
      name: "Equipment",
      value: "156",
      icon: FiTruck,
      change: "+1.2%",
      changeType: "increase",
    },
    {
      id: 4,
      name: "Tasks Completed",
      value: "89%",
      icon: FiCheckSquare,
      change: "+4.1%",
      changeType: "increase",
    },
  ];

  const recentProjects = [
    { id: 1, name: "City Center Mall", progress: 75, status: "In Progress" },
    { id: 2, name: "Metro Station", progress: 45, status: "In Progress" },
    { id: 3, name: "Office Complex", progress: 90, status: "Near Completion" },
    { id: 4, name: "Residential Tower", progress: 30, status: "Early Stage" },
  ];

  const upcomingTasks = [
    { id: 1, title: "Site Inspection", date: "2024-03-31", priority: "High" },
    { id: 2, title: "Team Meeting", date: "2024-04-01", priority: "Medium" },
    {
      id: 3,
      title: "Equipment Maintenance",
      date: "2024-04-02",
      priority: "Low",
    },
    { id: 4, title: "Progress Review", date: "2024-04-03", priority: "High" },
  ];
  const tableHeaders = [
    "Profile Pic",
    "First Name",
    "Last Name",
    "Email",
    "Role",
    "Gender",
    "Address",
    "DOB",
    "Created At",
    "Updated At",
    "Status",
    "Actions",
  ];
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {localStorage.getItem("userName")}
          </h1>
          <p className="mt-2 text-gray-600">
            Here's what's happening with your projects today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-lg">
                  <stat.icon className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-4">
                <span
                  className={`text-sm font-medium ${
                    stat.changeType === "increase"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-sm text-gray-600"> from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Projects
            </h2>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="border-b border-gray-100 last:border-0 pb-4 last:pb-0"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {project.name}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        project.status === "In Progress"
                          ? "bg-blue-100 text-blue-800"
                          : project.status === "Near Completion"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {project.progress}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Tasks
            </h2>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "High"
                          ? "bg-red-500"
                          : task.priority === "Medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">
                        <FiCalendar className="inline-block mr-1" />
                        {new Date(task.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      task.priority === "High"
                        ? "bg-red-100 text-red-800"
                        : task.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-red-700">
              User Management
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                <FiUpload className="mr-1" /> Import CSV
              </button>
              <button
                onClick={handleCsvExport}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                <FiDownload className="mr-1" /> Export CSV
              </button>
              <button
                onClick={() => handleTemplateDownload()}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-md flex items-center"
              >
                <FiDownload className="mr-1" /> Download Template
              </button>
              <button
                onClick={() => handleOpenModal()}
                className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium shadow-md"
              >
                + Add User
              </button>
            </div>
          </div>

          <input
            type="text"
            placeholder="Search for users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500 shadow-sm"
          />

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse rounded-lg overflow-hidden shadow-md">
              <thead className="bg-red-300">
                <tr>
                  {tableHeaders.map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-sm font-semibold text-red-900"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-b hover:bg-red-100 transition"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={
                            user.proPic ||
                            "https://th.bing.com/th/id/OIP._oHjxcDbPRe0HSQA1B4SygHaHa?rs=1&pid=ImgDetMain"
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://th.bing.com/th/id/OIP._oHjxcDbPRe0HSQA1B4SygHaHa?rs=1&pid=ImgDetMain";
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {user.fName}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {user.lName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-gray-600">{user.role}</td>
                      <td className="px-6 py-4 text-gray-600">{user.gender}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {user.address}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.dob).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                            user.status === "Active"
                              ? "bg-green-300 text-green-900"
                              : "bg-red-300 text-red-900"
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className="text-blue-700 hover:text-blue-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-700 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="px-6 py-4 text-center text-gray-700"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[32rem] shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingUser ? "Edit User" : "Add New User"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 flex justify-center">
                    <div className="relative">
                      <img
                        src={
                          newUser.proPic ||
                          "https://th.bing.com/th/id/OIP._oHjxcDbPRe0HSQA1B4SygHaHa?rs=1&pid=ImgDetMain"
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-2 border-red-500"
                        onError={(e) => {
                          e.target.src =
                            "https://th.bing.com/th/id/OIP._oHjxcDbPRe0HSQA1B4SygHaHa?rs=1&pid=ImgDetMain";
                        }}
                      />
                      <input
                        type="file"
                        id="proPic"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewUser({ ...newUser, proPic: reader.result });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />

                      <label
                        htmlFor="proPic"
                        className="absolute bottom-0 right-0 bg-red-500 text-white p-1 rounded-full cursor-pointer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={newUser.fName || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, fName: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (
                          /^\d$/.test(e.key) &&
                          !e.ctrlKey &&
                          !e.altKey &&
                          !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={newUser.lName || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, lName: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (
                          /^\d$/.test(e.key) &&
                          !e.ctrlKey &&
                          !e.altKey &&
                          !e.metaKey
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={newUser.email || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role
                    </label>
                    <select
                      value={newUser.role || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      value={newUser.gender || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, gender: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={
                        newUser.dob
                          ? new Date(newUser.dob).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        setNewUser({ ...newUser, dob: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                      max={new Date().toISOString().split("T")[0]} // This prevents selecting future dates
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      value={newUser.address || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, address: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={newUser.status || "Active"}
                      onChange={(e) =>
                        setNewUser({ ...newUser, status: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
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
                    {editingUser ? "Update" : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {isImportModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Import Users from CSV
              </h3>
              <div className="mb-4">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-red-50 file:text-red-700
                    hover:file:bg-red-100"
                />
                {importError && (
                  <p className="text-red-500 mt-2 text-sm">{importError}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCsvImport}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
