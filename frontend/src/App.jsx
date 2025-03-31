import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Task from './pages/task';
import Purchase from './pages/purchase';
import Test from './pages/test';
import InventoryManagement from './pages/machineInventory';
import AddMachineForm from './pages/addMachineForm';
import SignIn from './pages/signIn';
import signUp from './pages/signUp';
import ExpensesPage from './pages/Expenses';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task" element={<Task />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<signUp />} />
        <Route path="/machineInventory" element={<InventoryManagement />} />
        <Route path="/add-machine" element={<AddMachineForm />} />
        <Route path="/expenses" element={<ExpensesPage />} />
      </Routes>
    </Router>
  );
}

export default App;
