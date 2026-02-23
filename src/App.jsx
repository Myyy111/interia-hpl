import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/landing/Home';
import ConfiguratorLayout from './pages/configurator/ConfiguratorLayout';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminSettings from './admin/AdminSettings';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page Publik */}
        <Route path="/" element={<Home />} />

        {/* Configurator App */}
        <Route path="/configurator" element={<ConfiguratorLayout />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
