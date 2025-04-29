import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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

const App = () => {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
};

export default App;
