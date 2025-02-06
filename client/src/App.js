import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header/Header';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import ProductPage from './pages/ProductPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/:departmentName/:categoryName/:subcategoryName" element={<SearchResults />} />
          <Route path="/:departmentName/:categoryName" element={<SearchResults />} />
          <Route path="/:departmentName" element={<SearchResults />} />
          <Route path="/produto/:nome" component={ProductPage} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
