import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../../context/authContext";

const UserMenu = () => {
    const {isLoggedIn, userName, logout} = useAuth();
    
    return isLoggedIn ? (
        <div className='p-2'>
            <p className='text-sm font-bold text-gray-300'>Olá, {userName}</p>
            <div className='relative group'>
                <div className=' flex items-center text-gray-300 hover:text-white cursor-pointer'>
                    <p>Minha conta <FontAwesomeIcon icon={faChevronDown} className='ml-2 transition-transform duration-500 transform group-hover:rotate-180 text-orange-500'/></p>
                </div>
                <div className='absolute right-0 mt-2 w-48 bg-gray-800 text-white shadow-lg invisible group-hover:visible delay-150'>
                    <a href="/" className='block px-4 py-2 hover:bg-gray-700 cursor-pointer'>Minha Conta</a>
                    <a href="/" className='block px-4 py-2 hover:bg-gray-700 cursor-pointer'>Meus Pedidos</a>
                    <a href="/" className='block px-4 py-2 hover:bg-gray-700 cursor-pointer'>Meus Dados</a>
                    <button onClick={logout} className='block flex justify-start px-4 py-2 hover:bg-gray-700 cursor-pointer w-full'>SAIR</button>
                </div>
            </div>
        </div>
    ) : (
        <p className='text-gray-300 text-sm p-2'><a href="/login"><span className='font-bold cursor-pointer'>ENTRE</span></a> <span>ou</span><br/> <a href="/cadastro"><span className='font-bold cursor-pointer'>CADASTRE-SE</span></a></p>
    );
};

export default UserMenu;