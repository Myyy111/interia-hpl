import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/landing/Home';
import ConfiguratorLayout from './pages/configurator/ConfiguratorLayout';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminOrders from './admin/AdminOrders';
import AdminProducts from './admin/AdminProducts';
import AdminSettings from './admin/AdminSettings';
import CMSGeneral from './admin/cms/CMSGeneral';
import CMSCatalog from './admin/cms/CMSCatalog';
import CMSCommunity from './admin/cms/CMSCommunity';
import CMSBlog from './admin/cms/CMSBlog';

import ErrorBoundary from './components/ErrorBoundary';

import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Landing Page Publik */}
          <Route path="/" element={<Home />} />

          {/* Configurator App */}
          <Route path="/configurator" element={<ConfiguratorLayout />} />

          {/* admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="settings" element={<AdminSettings />}>
              <Route index element={<CMSGeneral />} />
              <Route path="catalog" element={<CMSCatalog />} />
              <Route path="community" element={<CMSCommunity />} />
              <Route path="blog" element={<CMSBlog />} />
            </Route>
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
