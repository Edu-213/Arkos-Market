import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuth } from '../context/authContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const token = Cookies.get('token');
  const { isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (token) {
          const response = await axios.get('http://localhost:5000/api/cart', { headers: { Authorization: `Bearer ${token}` } }, { withCredentials: true });
          setCart(response.data);
        } else {
          let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
          if (!Array.isArray(localCart)) localCart = [];

          const detailedCart = await Promise.all(
            localCart.map(async item => {
              try {
                const productResponse = await axios.get(`http://localhost:5000/api/products/id/${item.productId}`);
                return { product: productResponse.data, quantity: item.quantity };
              } catch (error) {
                console.error('Erro ao buscar produto:', error);
                return null;
              }
            })
          );
          setCart({ items: detailedCart.filter(item => item !== null) });
        }
      } catch (err) {
        console.error('Erro ao buscar carrinho:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const addToCartMDB = async (productId, quantity) => {
    if (isLoggedIn) {
      try {
        const cartResponse = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const currentCart = cartResponse.data;
        console.log('Carrinho atual:', currentCart);
        const itemExists = currentCart.items.some(item => item.product._id === productId);

        if (itemExists) {
          await axios.delete('http://localhost:5000/api/cart/remove', {
            headers: { Authorization: `Bearer ${token}` },
            data: { productId }
          });
        } else {
          await axios.post(
            'http://localhost:5000/api/cart/add',
            { productId, quantity: 1 },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }

        const updatedCartResponse = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCart(updatedCartResponse.data);
      } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error.response?.data || error.message);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart')) || [];

      if (!Array.isArray(localCart)) {
        localCart = [];
      }
      const itemExists = localCart.some(item => item.productId === productId);

      if (itemExists) {
        localCart = localCart.filter(item => item.productId !== productId);
        localStorage.setItem('cart', JSON.stringify(localCart));
      } else {
        localCart.push({ productId, quantity });
        localStorage.setItem('cart', JSON.stringify(localCart));
      }

      setCart({ items: localCart });
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    if (token) {
      try {
        await axios.put(
          'http://localhost:5000/api/cart/update',
          { productId, quantity: newQuantity },
          { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
        );
        setCart(prevCart => ({ ...prevCart, items: prevCart.items.map(item => (item.product._id === productId ? { ...item, quantity: newQuantity } : item)) }));
      } catch (err) {
        console.error('Erro ao atualizar quantidade:', err);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const itemIndex = localCart.findIndex(item => item.productId === productId);

      if (itemIndex >= 0) {
        localCart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(localCart));

        setCart(prevCart => ({ ...prevCart, items: prevCart.items.map(item => (item.product._id === productId ? { ...item, quantity: newQuantity } : item)) }));
      }
    }
  };

  const removeItem = async productId => {
    if (token) {
      try {
        await axios.delete('http://localhost:5000/api/cart/remove', { headers: { Authorization: `Bearer ${token}` }, data: { productId }, withCredentials: true });
        setCart(prevCart => ({ ...prevCart, items: prevCart.items.filter(item => item.product._id !== productId) }));
      } catch (err) {
        console.error('Erro ao remover item:', err);
      }
    } else {
      let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      localCart = localCart.filter(item => item.productId !== productId);
      localStorage.setItem('cart', JSON.stringify(localCart));
      setCart(prevCart => ({ ...prevCart, items: prevCart.items.filter(item => item.product._id !== productId) }));
    }
  };

  const clearCart = async () => {
    if (token) {
      await axios.delete('http://localhost:5000/api/cart/clear', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true });
      setCart({ items: [] });
    } else {
      localStorage.removeItem('cart');
      setCart({ items: [] });
    }
  };

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return <CartContext.Provider value={{ cart, setCart, loading, addToCartMDB, updateQuantity, removeItem, clearCart, totalItems }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
