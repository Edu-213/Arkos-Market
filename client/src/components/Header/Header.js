import React, {useEffect, useRef, useState, useCallback } from 'react';
import {useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faHeart, faCartShopping, faUser, faBars } from '@fortawesome/free-solid-svg-icons';
import {useAuth} from '../../context/authContext';
import useIsMobile from '../../hooks/useIsMobile';
import SearchBar from './SearchBar';
import UserMenu from './UserMenu';
import OpenMenu from './OpenMenu';
import { useCart } from '../../context/CartContext';

function Header() {
    const {isLoggedIn, userName, logout} = useAuth();
    const { totalItems } = useCart();
    const location = useLocation();
    const isLoginPage = ['/login', '/cadastro'].includes(location.pathname);
    const isCartPage = location.pathname === '/carrinho';
    const isMobile = useIsMobile(768);
    console.log(totalItems);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [isMenuOpen])

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsFocus(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleScroll = useCallback(() => {
        if (isCartPage) return;
        setIsScrolled(window.scrollY > 100);
        if (window.scrollY > 100 && isFocus) setIsFocus(false);
    }, [isFocus, isCartPage]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <header className={`z-50 ${isScrolled ? 'bg-gray-700 fixed w-full' : 'bg-gray-700'}`}>
            <div className={`container mx-auto flex md:items-center justify-between px-4 ${isScrolled ? '' : 'md:h-24'}`}>

                {/*Overlay */}
                {((isFocus && searchTerm) || (isMenuOpen && !isMobile)) && (
                    <div className="fixed inset-0 bg-black opacity-70 z-20 pointer-events-auto"></div>
                )}
                
                {!isLoginPage && !isMenuOpen && !isCartPage && (
                    <button className={`text-white text-2xl md:mr-4`} onClick={() => setIsMenuOpen(!isMenuOpen)}><FontAwesomeIcon icon={faBars} /></button>
                )}

                {isMenuOpen && isMobile && (
                    <button className="bg-transparent" onClick={() => setIsMenuOpen(false)}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg" ><path fill-rule="evenodd" clip-rule="evenodd" d="M22 3.76101L20.239 2L12 10.2075L3.76101 2L2 3.76101L10.2075 12L2 20.239L3.76101 22L12 13.7925L20.239 22L22 20.239L13.7925 12L22 3.76101Z" fill="#ffffffff"></path></svg></button>
                )}

                {(isLoginPage || isCartPage )&& isMobile && (
                    <button className='text-white'><a href='/' className='flex items-center gap-2'><svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.91673 14L9.18945 12.7273L3.46218 7L9.18945 1.27273L7.91673 0L0.916725 7L7.91673 14Z" className='fill-white'></path></svg>Voltar </a></button>
                )}
                
                {isScrolled && isMobile && !isCartPage && (
                    <div className='w-full'>
                        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isFocus={isFocus} setIsFocus={setIsFocus} isScrolled={isScrolled} />
                    </div>
                )}
                
                {/* Logo */}
                <div className={`md:justify-start ${isScrolled ? 'hidden md:flex' : 'flex'}`}>
                    <a href="/"><img src="/imagens/Logo.png" alt='logo' className={`${isScrolled ? '' : 'h-12 md:h-20'}`}></img></a>
                </div>
                {isMobile && !isLoginPage && !isCartPage && (
                    <div className=" relative flex items-center space-x-4">
                        <p className=" text-xl text-white cursor-pointer">
                            <a href="/carrinho"><FontAwesomeIcon icon={faCartShopping} />
                            {totalItems > 0 && (
                                <span className='absolute top-[-2px] right-[-15px] bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>{totalItems}</span>
                            )}
                            </a>
                        </p>
                    </div>
                )}
                
                {/*Menu para telas maiores */}
                {!isMobile && (
                    <div ref={searchRef} className={`flex items-center justify-center ${isLoginPage ? 'justify-end' : 'flex-1'}`}>
                        {!isLoginPage && <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isFocus={isFocus} setIsFocus={setIsFocus} isScrolled={isScrolled} />}
                        <p className='text-3xl ml-4 text-gray-300'><FontAwesomeIcon icon={faUser} /></p>
                        <UserMenu isLoggedIn={isLoggedIn} userName={userName} logout={logout}/>
                    </div>
                )}

                {/*Icones do lado direito */}
                {!isMobile && !isLoginPage && (
                    <div className='relative flex items-center space-x-2 text-xl'>
                        <p className='text-xl cursor-pointer'><FontAwesomeIcon icon={faHeart}/></p>
                        <a href="/carrinho"><FontAwesomeIcon icon={faCartShopping} />
                        {totalItems > 0 && (
                            <span className='absolute top-[-15px] right-[-12px] bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center'>{totalItems}</span>
                        )}</a>
                        
                    </div>
                )}
            </div>
            
            {isMobile && !isCartPage && (
                <div className={`${isScrolled ? 'hidden' : 'flex'}`}>
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} isFocus={isFocus} setIsFocus={setIsFocus} isScrolled={isScrolled} />
                </div>
            )}

            <OpenMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isScrolled={isScrolled}/>
        </header>
    ) 
}

export default Header;