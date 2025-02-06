import React, { useEffect } from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Catalog from './pages/Catalog';
import AdminPanel from './pages/AdminPanel';
import Header from './components/Header/Header';
import Cart from './pages/Cart';
import SearchResults from './pages/SearchResults';
import axios from 'axios';

function App() {
  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      syncCart(token);
    }
  }, []);

  const syncCart = async token => {
    let localCart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (localCart.length > 0) {
      // Agrupar itens pelo ID e somar quantidades
      const mergedCart = localCart.reduce((acc, item) => {
        const existingItem = acc.find(prod => prod.id === item.id);
        if (existingItem) {
          existingItem.quantity += item.quantity; // Somar quantidades
        } else {
          acc.push({ ...item });
        }
        return acc;
      }, []);

      try {
        await axios.post(
          'http://localhost:5000/api/cart/sync',
          { cart: mergedCart },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Erro ao sincronizar o carrinho:', error);
      }
    }
  };

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
