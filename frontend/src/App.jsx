import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Task from "./pages/task";
import Purchase from "./pages/purchase";
import Test from "./pages/test";
import InventoryManagement from "./pages/machineInventory";
import AddMachineForm from "./pages/addMachineForm";
import SignIn from "./pages/signIn";
import ExpensesPage from "./pages/Expenses";
import SignUp from "./pages/signUp";
import UserDashboard from "./pages/UserDashboard";
import LabourAssignment from "./pages/Assign";
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetails from './pages/ProjectDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assign" element={<LabourAssignment />} />
        <Route path="/task" element={<Task />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/machineInventory" element={<InventoryManagement />} />
        <Route path="/add-machine" element={<AddMachineForm />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/machineInventory" element={<InventoryManagement />} />
        <Route path="/userdashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
