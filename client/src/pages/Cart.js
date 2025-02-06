import React, {useEffect, useState} from 'react';
import axios from 'axios';
import CartItem from '../components/cartComponents/CartItem';
import Cookies from 'js-cookie';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const token = Cookies.get('token');

    useEffect(() => {
        const fetchCart = async() => {
            setLoading(true);
            try {
                if (token) {
                    const response = await axios.get('http://localhost:5000/api/cart', {headers: { 'Authorization': `Bearer ${token}` } }, {withCredentials: true});
                    setCart(response.data);
                } else {
                    let localCart = JSON.parse(localStorage.getItem("cart") || "[]");
                    if (!Array.isArray(localCart)) localCart = [];

                    const detailedCart = await Promise.all(localCart.map(async (item) => {
                        try {
                            const productResponse = await axios.get(`http://localhost:5000/api/products/id/${item.productId}`);
                            return { product: productResponse.data, quantity: item.quantity };
                        } catch (error) {
                            console.error("Erro ao buscar produto:", error);
                            return null;
                        }
                    }))
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

    const updateQuantity = async(productId, newQuantity) =>{
        if(newQuantity < 1) return;

        if (token) {
            try {
                await axios.put( 'http://localhost:5000/api/cart/update', { productId, quantity: newQuantity }, {headers: { 'Authorization': `Bearer ${token}` } }, {withCredentials: true} );
                setCart(prevCart => ({...prevCart, items: prevCart.items.map(item => item.product._id === productId ? {...item, quantity: newQuantity} : item)}));
            } catch (err) {
                console.error('Erro ao atualizar quantidade:', err);
            }
        } else {
            let localCart = JSON.parse(localStorage.getItem("cart") || "[]");
            const itemIndex = localCart.findIndex(item => item.productId === productId);

            if (itemIndex >= 0) {
                localCart[itemIndex].quantity = newQuantity;
                localStorage.setItem("cart", JSON.stringify(localCart));

                setCart(prevCart => ({...prevCart, items: prevCart.items.map(item => item.product._id === productId ? { ...item, quantity: newQuantity } : item )}));
            }
        }
    };

    const removeItem = async(productId) => {
        if (token) {
            try {
                await axios.delete('http://localhost:5000/api/cart/remove', {headers: { 'Authorization': `Bearer ${token}` }, data: { productId }, withCredentials: true});
                setCart(prevCart => ({...prevCart, items: prevCart.items.filter(item => item.product._id !== productId)}));
            } catch (err) {
                console.error('Erro ao remover item:', err);
            }
        } else {
            let localCart = JSON.parse(localStorage.getItem("cart") || "[]");
            localCart = localCart.filter(item => item.productId !== productId);
            localStorage.setItem("cart", JSON.stringify(localCart));
            setCart(prevCart => ({...prevCart, items: prevCart.items.filter(item => item.product._id !== productId),}));
        }
        
    };

    useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => setErrorMessage(""), 300000);
            return () => clearTimeout(timer);
        }
    }, [errorMessage]);

    if (loading) return <p>Carregando carrinho...</p>;

    return (
        
        <div className="container mx-auto">
            {errorMessage && (
                <div>
                    <ol className='fixed top-0 left-1/2 transform -translate-x-1/2 bg-red-700 text-white rounded shadow-lg z-50 max-w-[90%] w-max text-center'>
                        <li className='py-[0.75rem] px-[2rem] leading-[1.125rem]'>{errorMessage}</li>
                    </ol>
                </div>
            )}
            <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>
            <div>
                {cart && cart.items.length > 0 ? (
                    <div className="flex">
                        <div className='flex flex-col w-full'>
                            {cart.items.map((item) => (
                            <CartItem key={item.product._id} item={item} removeFromCart={() => removeItem(item.product._id)} updateQuantity={(newQuantity) => updateQuantity(item.product._id, newQuantity)} setErrorMessage={setErrorMessage}/>
                            ))}
                        </div>
                    
                        <div className="hidden md:flex justify-between items-center border-t pt-4 mt-4 flex-col ml-20">
                            <h2 className="text-xl font-bold">Total: R$ {cart.items.reduce((total, item) => total + (item.product.finalPriceWithPix || item.product.finalPrice) * item.quantity, 0).toFixed(2)}</h2>
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                            Finalizar Compra
                            </button>
                        </div>

                    </div>
                ) : (
                    <p>Seu carrinho está vazio. <a href="/" className="text-blue-500 underline">Voltar ao catálogo</a>.</p>
                )}
            </div>
            <div>
                a
            </div>
            </div>
    );
};

export default Cart;