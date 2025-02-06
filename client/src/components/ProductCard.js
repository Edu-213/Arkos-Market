import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/authContext";
import axios from 'axios';
import Cookies from 'js-cookie';
import '../principal.css'

const ProductCard = ({product}) => {
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState("left-full");
    const tooltipRef = useRef(null);
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    useEffect(() => {
        const fetchCart = async() => {
            if (isLoggedIn) {
                try {
                    const token = Cookies.get('token');
                    const response = await axios.get('http://localhost:5000/api/cart', {headers: { 'Authorization': `Bearer ${token} }`} });
                    const cart = response.data;
                    const productInCart = cart?.items?.some(item => item.product.id === product.id);
                    setIsInCart(productInCart);
                } catch (error) {
                    console.error('Erro ao buscar carrinho:', error.response?.data || error.message);
                } 
            } else {
                let localCart = JSON.parse(localStorage.getItem('cart')) || [];
                const productInLocalCart = localCart.some(item => item.productId === product.id);
                setIsInCart(productInLocalCart);
            }
            
        };
        fetchCart();
    }, [isLoggedIn, product.id]);


    const handleAddToFavorites = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(isLoggedIn) {
            setIsFavorite(!isFavorite);
        } else {
            navigate("/login");
        }
    }

    const addToCartMDB = async(productId, quantity) => {
        if (isLoggedIn) {
            try {
                const token = Cookies.get('token');
                if (isInCart) {
                    const response = await axios.delete('http://localhost:5000/api/cart/remove', {headers: { 'Authorization': `Bearer ${token}` }, data: { productId } });
                    
                    if (response.status !== 200) {
                        throw new Error('Erro ao remover do carrinho');
                    } 
                } else {
                    const response = await axios.post('http://localhost:5000/api/cart/add', { productId, quantity }, {headers: { 'Authorization': `Bearer ${token}` } });
                    if (response.status !== 200) {
                        throw new Error('Erro ao adicionar ao carrinho');
                    }
            
                    console.log('Carrinho atualizado:', response.data);
                }
                setIsInCart(!isInCart);
            } catch (error) {
                console.error('Erro ao adicionar ao carrinho:', error.response?.data || error.message);
            }
        } else {
            let localCart = JSON.parse(localStorage.getItem("cart")) || [];
            if (!Array.isArray(localCart)) {
                localCart = [];
            }
            
            if (isInCart) {
                const newCart = localCart.filter(item => item.productId !== productId);
                localStorage.setItem("cart", JSON.stringify(newCart));
            } else {
                localCart.push({ productId, quantity });
                localStorage.setItem("cart", JSON.stringify(localCart));
            }

            setIsInCart(!isInCart);
        }
    }

    const handlerClick = () => {
        navigate(`/product/id/${product._id}`);
    };

    const handleTooltipPosition = () => {
        if (tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            
            if (rect.left < 100) {
                setTooltipPosition("left-full");
            } else {
                setTooltipPosition("right-full");
            }
        }
    };

    return (
        <div>
            <article className="flex flex-col w-[18.125rem] h-[14.125rem] md:w-72 md:h-[28rem] group full border border-gray-200 rounded-lg shadow-md md:hover-shadow-lg md:transition-shadow cursor-pointer p-2" onClick={handlerClick}>
                <div className="relative flex justify-between md:justify-end w-full">
                    {product.comments?.length > 0 && (
                        <div className="absolute flex items-center text-yellow-300 text-sm md:group-hover:opacity-0 md:transition-opacity md:duration-200">
                            {[...Array(5)].map((_, index) => (
                                <FontAwesomeIcon icon={faStar} />
                            ))}
                            <span className="text-gray-500 p-1">({(product.comments.length)})</span>
                        </div>
                    )}
                    <div className="relative flex items-center justify-end w-full md:opacity-0 md:group-hover:opacity-100 md:transition-opacity md:duration-200 text-xl md:text-2xl text-gray-400">
                        <p onClick={handleAddToFavorites} className={`mr-2 cursor-pointer ${isFavorite ? "text-red-500" : "text-gray-400"}`}><FontAwesomeIcon icon={faHeart} /></p>
                        <p onClick={(e) => {e.stopPropagation(); addToCartMDB(product.id, 1)}} className={`cursor-pointer ${isInCart ? "text-green-600" : "text-gray-400"}`}><FontAwesomeIcon icon={faCartShopping} /></p>
                    </div>
                </div>
                <div className="flex md:flex-col">
                    {product.image && (
                        <img src={`http://localhost:5000${product.image}`} alt={product.name} className="w-[5.75rem] h-[5.75rem] md:w-full md:h-40 object-cover rounded-lg mb-4" draggable="false" />
                    )}
                    <div className="flex flex-col mt-2 md:mt-0 p-2 md:p-0">
                        <button className="relative group text-left" onMouseEnter={handleTooltipPosition}>
                            <div>
                                <h3 className="text-xs md:text-sm md:font-bold text-gray-800 line-clamp-3">{product.name}</h3>
                                <div ref={tooltipRef} className={`absolute ${tooltipPosition} top-4 mt-1 hidden md:group-hover:flex bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap z-10 shadow-lg ml-3 mr-3`}>
                                    {product.name}
                                </div>
                            </div>
                        </button>
                        <div className="md:mt-3">
                            <div className={product.category.discount > 0 ? "" : "min-h-[1.25rem]"}>
                                {product.category.discount > 0 && (
                                    <span className="text-[0.625rem] md:text-xs line-through text-gray-500">{formatCurrency(product.price)}</span>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="text-sm md:text-xl font-bold">{formatCurrency(product.finalPriceWithPix)}</span>
                                {product.category.discount > 0 && (
                                    <div className="text-xs flex rounded-xl text-white px-1 group-hover:hidden bg-orange-500 ml-2">
                                        -{product.category.discount}%
                                    </div>
                                )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-500">ou até <span className="font-bold">{product.maxInstallments ? `${product.maxInstallments}x de ${formatCurrency(product.finalPrice / product.maxInstallments)}` : ""}</span></p>
                        </div>
                    </div>

                </div>
                    
                <div className=" mt-auto"> 
                    <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition-colors w-full">
                        Comprar
                    </button>
                </div>


            </article>
        </div>
    );
};

export default ProductCard;