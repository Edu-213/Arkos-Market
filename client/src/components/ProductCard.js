import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/authContext";
import { useCart } from "../context/CartContext";
import useIsMobile from "../hooks/useIsMobile";
import useFormatCurrency from "../hooks/useFormatCurrency";

const ProductCard = ({product}) => {
    const {cart = [], addToCartMDB} = useCart();
    const [isInCart, setIsInCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState("left-full");
    const tooltipRef = useRef(null);
    const {isLoggedIn} = useAuth();
    const navigate = useNavigate();
    const isMobile = useIsMobile(768);
    const formatCurrency = useFormatCurrency();

    useEffect(() => {
        const fetchCart = async() => {
            if (isLoggedIn) {
                const productInCart = cart?.items?.some(item => item.product.id === product.id);
                setIsInCart(productInCart);
            }else {
                let localCart = JSON.parse(localStorage.getItem('cart')) || [];
                const productInLocalCart = localCart.some(item => item.productId === product.id);
                setIsInCart(productInLocalCart);
            }
        };

        fetchCart();
    }, [isLoggedIn, cart, product.id]);

    const handleAddToFavorites = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if(isLoggedIn) {
            setIsFavorite(!isFavorite);
        } else {
            navigate("/login");
        }
    }

    const handlerClick = () => {
        navigate(`/produto/${product.slug}`);
    };

    const handleTooltipPosition = () => {
        if (tooltipRef.current) {
            const rect = tooltipRef.current.getBoundingClientRect();
            
            if (rect.left < 400) {
                setTooltipPosition("left-full");
            } else {
                setTooltipPosition("right-full");
            }
        }
    };

    return (
        <div className="p-[2px] shadow-[0_0_1px_rgba(40,41,61,0.08),0_0.5px_2px_rgba(96,97,112,0.16)] group rounded-[4px] md:hover:shadow-md w-[17.75rem] h-[11.25rem] md:w-[16.875rem] md:h-[24.25rem]">
            <article className="flex flex-col cursor-pointer py-[0.25rem] md:py-[0.625rem] px-[0.5rem] md:px-[0.1875rem]" onClick={handlerClick}>
                <div className="relative flex justify-between md:justify-end w-full h-[1.625rem] min-h-[1.625rem] py-[0.313rem] px-[0.5rem]">
                    {product.comments?.length > 0 && (
                        <div className="flex items-center w-full justify-start md:justify-end md:group-hover:opacity-0 md:transition-opacity md:duration-200 gap-[0.25rem]">
                            {[...Array(5)].map((_, index) => (
                                <svg key={index} width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M17.434 23.7375C17.6965 23.8875 17.9965 24 18.334 24C18.8215 24 19.3465 23.775 19.6465 23.3625C19.9465 22.95 20.059 22.425 19.9465 21.9375L18.409 15.375C18.409 15.3 18.4465 15.225 18.484 15.1875L23.3965 10.7625C23.9215 10.3125 24.109 9.6 23.884 8.9625C23.659 8.325 23.0965 7.875 22.4215 7.8375L16.084 7.35C16.009 7.35 15.9715 7.3125 15.934 7.2375L13.5715 1.0875C13.309 0.4125 12.709 0 11.9965 0C11.284 0 10.684 0.4125 10.384 1.0875L8.02153 7.2375C7.98403 7.3125 7.94653 7.35 7.87153 7.35L1.53403 7.8375C0.859031 7.875 0.296531 8.325 0.0715307 8.9625C-0.115969 9.6 0.0715306 10.3125 0.559031 10.7625L5.47153 15.1875C5.54653 15.225 5.54653 15.3 5.54653 15.375L4.04653 21.9375C3.89653 22.425 4.00903 22.95 4.34653 23.3625C4.64653 23.775 5.13403 24 5.65903 24C5.99653 24 6.29653 23.8875 6.59653 23.7375L11.9215 20.25C11.9965 20.2125 12.034 20.2125 12.109 20.25L17.434 23.7375Z" fill="#FFBC05"></path></svg>
                            ))}
                            <span className="text-muted text-[0.625rem]">({(product.comments.length)})</span>
                        </div>
                    )}

                    {isMobile && (
                        <div className="flex justify-end items-center">
                            {cart ? (
                                <svg width="1.5rem" height="1.5rem" viewBox="0 0 23 22" fill="none" xmlns="https://www.w3.org/2000/svg" onClick={(e) => {e.stopPropagation(); addToCartMDB(product.id, 1)}}><g><path d="M17.0021 17.2153V15.6203H6.6523C6.52407 15.5837 6.43248 15.4828 6.43248 15.3545L6.45995 15.2445L7.26596 13.2278H14.5749C15.2252 13.2278 15.7931 12.8612 16.0862 12.3112L16.8922 10.817C14.2819 10.1937 12.2852 7.98449 11.9921 5.25283H4.7472L3.90456 3.66699H0.973633V5.26199H2.75051L5.9562 12.247L4.75636 14.502C4.5457 14.8778 4.47242 15.3545 4.59149 15.8403C4.79299 16.6745 5.58068 17.2245 6.41416 17.2245H17.0021V17.2153Z" fill="#FF6500"></path><path d="M15.7929 18.334C14.8037 18.334 14.0068 19.159 14.0068 20.1673C14.0068 21.1757 14.8037 22.0007 15.7929 22.0007C16.7821 22.0007 17.5881 21.1757 17.5881 20.1673C17.5789 19.159 16.7729 18.334 15.7929 18.334Z" fill="#FF6500"></path><path d="M6.83584 18.334C5.84665 18.334 5.0498 19.159 5.0498 20.1673C5.0498 21.1757 5.84665 22.0007 6.83584 22.0007C7.82502 22.0007 8.63103 21.1757 8.63103 20.1673C8.62187 19.159 7.81586 18.334 6.83584 18.334Z" fill="#FF6500"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.956 4.58333C22.956 7.11333 20.9044 9.16667 18.3764 9.16667C15.8485 9.16667 13.7969 7.11333 13.7969 4.58333C13.7969 2.05333 15.8485 0 18.3764 0C20.9044 0 22.956 2.05333 22.956 4.58333ZM15.702 5.01417L17.3323 6.74667L21.0418 2.805L20.5655 2.29167L17.3415 5.72L16.1966 4.50083L15.702 5.01417Z" fill="#FF6500"></path></g></svg>
                            ) : (
                                <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" onClick={(e) => {e.stopPropagation(); addToCartMDB(product.id, 1)}}><path d="M17.5 18.78V17.04H6.2C6.06 17 5.96 16.89 5.96 16.75L5.99 16.63L6.87 14.43H14.85C15.56 14.43 16.18 14.03 16.5 13.43L17.38 11.8C14.53 11.12 12.35 8.71 12.03 5.73H4.12L3.2 4H0V5.74H1.94L5.44 13.36L4.13 15.82C3.9 16.23 3.82 16.75 3.95 17.28C4.17 18.19 5.03 18.79 5.94 18.79H17.5V18.78Z" fill="#42464D"></path><path d="M16.18 20C15.1 20 14.23 20.9 14.23 22C14.23 23.1 15.1 24 16.18 24C17.26 24 18.14 23.1 18.14 22C18.13 20.9 17.25 20 16.18 20Z" fill="#42464D"></path><path d="M6.40001 20C5.32001 20 4.45001 20.9 4.45001 22C4.45001 23.1 5.32001 24 6.40001 24C7.48001 24 8.36001 23.1 8.36001 22C8.35001 20.9 7.47001 20 6.40001 20Z" fill="#42464D"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19 0C16.238 0 14 2.23858 14 5C14 7.76203 16.2386 10 19 10C21.762 10 24 7.76142 24 5C24 2.23797 21.7614 0 19 0ZM18.4444 2.36249V4.44444H16.2236C15.9199 4.44444 15.6667 4.69318 15.6667 5C15.6667 5.30896 15.916 5.55556 16.2236 5.55556H18.4444V7.91529C18.4444 8.21902 18.6932 8.47222 19 8.47222C19.309 8.47222 19.5556 8.22288 19.5556 7.91529V5.55556H21.7764C22.0801 5.55556 22.3333 5.30682 22.3333 5C22.3333 4.69104 22.084 4.44444 21.7764 4.44444H19.5556V2.36249C19.5556 2.05876 19.3068 1.80556 19 1.80556C18.691 1.80556 18.4444 2.0549 18.4444 2.36249Z" fill="#42464D"></path></svg>
                            )}
                            
                        </div>
                    )}
                    
                </div>
                <div className="flex md:flex-col">
                    {product.image && (
                        <div className="relative md:p-[0.313rem]">
                            <img src={`http://localhost:5000${product.image[0]}`} alt={product.name} className="min-w-[5.75rem] w-[5.75rem] h-[5.75rem] md:w-full md:h-40 object-contain rounded-lg mb-4" draggable="false" />
                            <p onClick={(e) => {e.stopPropagation(); handleAddToFavorites(e)}} className="absolute right-[0.3125rem] top-[0.3125rem] z-10 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                                {isFavorite ? (
                                    <svg width="24" height="22" viewBox="0 0 28 25" fill="none" xmlns="https://www.w3.org/2000/svg" class="IconHeartOrange"><path fill-rule="evenodd" clip-rule="evenodd" d="M28 7.4645C28 3.527 24.7625 0.333252 20.7375 0.333252C17.675 0.333252 15.05 2.2145 14 4.8395C12.95 2.2145 10.325 0.333252 7.2625 0.333252C3.2375 0.333252 0 3.527 0 7.4645C0 7.50825 0 7.85825 0 7.9895C0 15.3395 14.525 24.8333 14.525 24.8333C14.525 24.8333 28 15.3395 28 7.9895C28 7.85825 28 7.552 28 7.4645Z" fill="#FF0000"></path></svg>
                                    
                                ) : (
                                    <svg width="24" height="22" viewBox="0 0 24 22" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 21.6L11.5875 21.3C11.1 20.9625 0 13.275 0 6.975V6.5625C0 2.9625 2.9625 0 6.6 0C8.8125 0 10.8 1.0875 12 2.85C13.2 1.0875 15.225 0 17.4 0C21.0375 0 24 2.925 24 6.5625V6.975C24 13.2375 12.9 20.9625 12.4125 21.3L12 21.6ZM6.6 1.5C3.7875 1.5 1.5 3.7875 1.5 6.5625V6.975C1.5 9.225 3.375 12.15 6.8625 15.525C9 17.5125 11.1 19.125 12 19.7625C12.9 19.125 15 17.5125 17.1375 15.525C20.625 12.15 22.5 9.225 22.5 6.975V6.5625C22.5 3.7875 20.2125 1.5 17.4 1.5C15.3 1.5 13.4625 2.7375 12.675 4.6875L12 6.45L11.2875 4.725C10.5375 2.775 8.6625 1.5 6.6 1.5Z" fill="#b6bbc2"></path></svg>
                                )}
                            </p>
                        </div>
                        
                    )}
                    <div className="relative flex flex-col py-[0.313rem] px-[0.313rem] md:px-[0.5rem] md:py-0">
                        <button className="relative group text-left" onMouseEnter={handleTooltipPosition}>
                            <div>
                                <h3 className="title-text md:w-full md:text-[0.875rem] md:font-semibold line-clamp-3 md:leading-[1.25rem] md:min-h[3.75rem]">{product.name}</h3>
                                <div ref={tooltipRef} className={`absolute ${tooltipPosition} top-4 mt-1 hidden md:group-hover:flex bg-gray-800 text-white text-xs rounded-md py-1 px-2 whitespace-nowrap z-10 shadow-lg ml-3 mr-3`}>
                                    {product.name}
                                </div>
                            </div>
                        </button>
                        <div className="">
                            <div className={product.category.discount > 0 ? "h-[1rem]" : "min-h-[1.25rem]"}>
                                {product.category.discount > 0 && (
                                    <span className="old-price-card md:text-xs line-through">{formatCurrency(product.price)}</span>
                                )}
                            </div>
                            <div className="flex items-center md:mt-[0.25rem]">
                                <span className="price-card h-[1.5rem] md:text-xl">{formatCurrency(product.finalPriceWithPix)}</span>
                                {product.category.discount > 0 && (
                                    <div className="discount rounded-xl group-hover:hidden ml-2 h-[1rem]">
                                        -{product.category.discount}%
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col h-2rem product-payment-text md:text-[0.75rem] h-[2rem]">
                                A vista no pix
                                <span className="text-[0.75rem]">ou até <span className="font-bold">{product.maxInstallments ? `${product.maxInstallments}x de ${formatCurrency(product.finalPrice / product.maxInstallments)}` : ""}</span></span>
                            </div>
                            
                        </div>
                        
                        {!isMobile && (
                            <div className="absolute right-3 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity md:duration-200">
                                {isInCart ? (
                                <svg width="1.875rem" height="1.875rem" viewBox="0 0 23 22" fill="none" xmlns="https://www.w3.org/2000/svg" onClick={(e) => {e.stopPropagation(); addToCartMDB(product.id, 1)}}><g><path d="M17.0021 17.2153V15.6203H6.6523C6.52407 15.5837 6.43248 15.4828 6.43248 15.3545L6.45995 15.2445L7.26596 13.2278H14.5749C15.2252 13.2278 15.7931 12.8612 16.0862 12.3112L16.8922 10.817C14.2819 10.1937 12.2852 7.98449 11.9921 5.25283H4.7472L3.90456 3.66699H0.973633V5.26199H2.75051L5.9562 12.247L4.75636 14.502C4.5457 14.8778 4.47242 15.3545 4.59149 15.8403C4.79299 16.6745 5.58068 17.2245 6.41416 17.2245H17.0021V17.2153Z" fill="#FF6500"></path><path d="M15.7929 18.334C14.8037 18.334 14.0068 19.159 14.0068 20.1673C14.0068 21.1757 14.8037 22.0007 15.7929 22.0007C16.7821 22.0007 17.5881 21.1757 17.5881 20.1673C17.5789 19.159 16.7729 18.334 15.7929 18.334Z" fill="#FF6500"></path><path d="M6.83584 18.334C5.84665 18.334 5.0498 19.159 5.0498 20.1673C5.0498 21.1757 5.84665 22.0007 6.83584 22.0007C7.82502 22.0007 8.63103 21.1757 8.63103 20.1673C8.62187 19.159 7.81586 18.334 6.83584 18.334Z" fill="#FF6500"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M22.956 4.58333C22.956 7.11333 20.9044 9.16667 18.3764 9.16667C15.8485 9.16667 13.7969 7.11333 13.7969 4.58333C13.7969 2.05333 15.8485 0 18.3764 0C20.9044 0 22.956 2.05333 22.956 4.58333ZM15.702 5.01417L17.3323 6.74667L21.0418 2.805L20.5655 2.29167L17.3415 5.72L16.1966 4.50083L15.702 5.01417Z" fill="#FF6500"></path></g></svg>
                            ) : (
                                <svg width="1.875rem" height="1.875rem" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" onClick={(e) => {e.stopPropagation(); addToCartMDB(product.id, 1)}}><path d="M17.5 18.78V17.04H6.2C6.06 17 5.96 16.89 5.96 16.75L5.99 16.63L6.87 14.43H14.85C15.56 14.43 16.18 14.03 16.5 13.43L17.38 11.8C14.53 11.12 12.35 8.71 12.03 5.73H4.12L3.2 4H0V5.74H1.94L5.44 13.36L4.13 15.82C3.9 16.23 3.82 16.75 3.95 17.28C4.17 18.19 5.03 18.79 5.94 18.79H17.5V18.78Z" fill="#42464D"></path><path d="M16.18 20C15.1 20 14.23 20.9 14.23 22C14.23 23.1 15.1 24 16.18 24C17.26 24 18.14 23.1 18.14 22C18.13 20.9 17.25 20 16.18 20Z" fill="#42464D"></path><path d="M6.40001 20C5.32001 20 4.45001 20.9 4.45001 22C4.45001 23.1 5.32001 24 6.40001 24C7.48001 24 8.36001 23.1 8.36001 22C8.35001 20.9 7.47001 20 6.40001 20Z" fill="#42464D"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M19 0C16.238 0 14 2.23858 14 5C14 7.76203 16.2386 10 19 10C21.762 10 24 7.76142 24 5C24 2.23797 21.7614 0 19 0ZM18.4444 2.36249V4.44444H16.2236C15.9199 4.44444 15.6667 4.69318 15.6667 5C15.6667 5.30896 15.916 5.55556 16.2236 5.55556H18.4444V7.91529C18.4444 8.21902 18.6932 8.47222 19 8.47222C19.309 8.47222 19.5556 8.22288 19.5556 7.91529V5.55556H21.7764C22.0801 5.55556 22.3333 5.30682 22.3333 5C22.3333 4.69104 22.084 4.44444 21.7764 4.44444H19.5556V2.36249C19.5556 2.05876 19.3068 1.80556 19 1.80556C18.691 1.80556 18.4444 2.0549 18.4444 2.36249Z" fill="#42464D"></path></svg>
                            )}
                            </div>
                        )}
                    </div>

                    

                </div>
                    


            </article>
        </div>
    );
};

export default ProductCard;