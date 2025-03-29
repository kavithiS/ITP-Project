import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Task from './pages/task';
import Purchase from './pages/purchase';
import Test from './pages/test';
import MachineInventory from './pages/machineInventory';
import SignIn from './pages/signIn';
import signUp from './pages/signUp';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task" element={<Task />} />
        <Route path="/purchase" element={<Purchase />} />
        <Route path="/test" element={<Test />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<signUp />} />
        <Route path="/machineInventory" element={<MachineInventory />} />
      </Routes>
    </Router>
  );
};

export default App;
