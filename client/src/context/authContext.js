import {createContext, useContext, useState, useEffect} from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
            fetchUserData(token);
            syncCart(token);
        }else {
            setIsLoggedIn(false);
        }
    }, []);

    const fetchUserData = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const firstName = data.name.split(' ')[0];
                setUserName(firstName);
            } else {
                console.error('Erro ao buscar dados do usuário');
            }
        } catch (error) {
            console.error('Erro ao fazer requisição:', error);
        }
    };

    const syncCart = async token => {
      let localCart = JSON.parse(localStorage.getItem('cart') || '[]');
  
        try {
          await axios.post(
            'http://localhost:5000/api/cart/sync',
            { cart: localCart },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          localStorage.removeItem('cart');
        } catch (error) {
          console.error('Erro ao sincronizar o carrinho:', error);
        }
    };

    const logout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        setUserName('');
    };

    return (
        <AuthContext.Provider value={{isLoggedIn, userName, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);