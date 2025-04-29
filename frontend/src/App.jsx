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
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import LabourAssignment from "./pages/Assign";
import TestBuilding from "./pages/TestBuilding";
import BuildingPage from "./pages/BuildingPage";
import ContactUs from "./pages/ContactUs";
import InquirePage from "./pages/InquirePage";
import InquiriesPage from "./pages/InquiriesPage";
import TeamPage from "./pages/TeamPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/assign" element={<LabourAssignment />} />
        <Route path="/building-page" element={<BuildingPage />} />
        <Route path="/test-building" element={<TestBuilding />} />
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
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/inquire" element={<InquirePage />} />
        <Route path="/inquiries" element={<InquiriesPage />} />
        <Route path="/team" element={<TeamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
