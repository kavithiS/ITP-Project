import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import AdminDashboard from './pages/AdminDashboard';
import ProjectDetails from './pages/ProjectDetails';
import TestBuilding from "./pages/TestBuilding";
import BuildingPage from "./pages/BuildingPage";
import ContactUs from "./pages/ContactUs";
import InquirePage from "./pages/InquirePage";
import InquiriesPage from "./pages/InquiriesPage";
import TeamPage from "./pages/TeamPage";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Expenses from './pages/Expenses';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

// Create a wrapper component to handle sidebar logic
const AppLayout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="flex">
      {!isHomePage && (
        <ErrorBoundary>
          <Sidebar />
        </ErrorBoundary>
      )}
      <main className={`flex-1 ${!isHomePage ? 'ml-64' : ''}`}>
        <Routes>
          <Route path="/" element={<Expenses />} />
          <Route path="/expenses" element={<Expenses />} />
        </Routes>
      </main>
    </div>
  );
};

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
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/inquire" element={<InquirePage />} />
        <Route path="/inquiries" element={<InquiriesPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/*" element={<AppLayout />} /> 
      </Routes>
    </Router>
  );
}


export default App;
