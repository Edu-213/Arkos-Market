import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faHouse } from "@fortawesome/free-solid-svg-icons";
import useIsMobile from '../../hooks/useIsMobile';
import { useAuth } from "../../context/authContext";

const OpenMenu = ({isOpen, onClose, isScrolled}) => {
    const menuRef = useRef(null);
    const isMobile = useIsMobile(768);
    const {isLoggedIn, userName, logout} = useAuth();

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <aside ref={menuRef} className={`transition-left duration-300 ease-in-out flex flex-col fixed w-full md:top-0 bottom-0 left-0 overscroll-contain bg-gray-700 z-50 md:max-w-[20.5rem] md:h-full md:top-0 ${isScrolled ? 'top-[60px]' : 'top-[110px]'}`}>
            {!isMobile && (
                <button className="absolute left-[calc(100%+1rem)] top-[1.5rem] bg-transparent" onClick={onClose}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="https://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22 3.76101L20.239 2L12 10.2075L3.76101 2L2 3.76101L10.2075 12L2 20.239L3.76101 22L12 13.7925L20.239 22L22 20.239L13.7925 12L22 3.76101Z" fill="#ffffffff"></path></svg></button>
            )}
            <div className="w-full flex items-center relative p-[1rem]">
                <p className="text-white text-[28px]"><FontAwesomeIcon icon={faUser} /></p>
                <h4 className="text-[1.25rem] text-white font-bold leading-[1.875rem] ml-[1rem]">{isLoggedIn ? `Olá. ${userName}` : 'Olá. Acesse sua conta'}</h4>
            </div>
            <div className="flex flex-col mx-[1rem] pr-[2rem] overflow-y-auto snap-y snap-mandatory">
                <ul className="flex flex-col">
                    <div>
                        <li className="p-[1rem] md:px-[1rem] md:py-[0.75rem] flex items-center snap-align-end snap-stop-normal text-[0.875rem] text-white leading-[0.875rem]">
                            <a href='/'>
                                <span className="pr-[1rem]"><FontAwesomeIcon icon={faHouse} /></span>
                                <span>Minha conta</span>
                            </a>
                        </li>
                    </div>

                </ul>
            </div>
            {isLoggedIn ? (
                <div className="flex flex-col w-full mt-auto py-[2rem] px-[1.5rem]">
                    <button type="button" className="text-[1.125rem] leading-[2rem] font-semibold uppercase cursor-pointer text-white h-[48px] px-[3rem] bg-orange-600 rounded-[0.25rem]" onClick={logout}>Sair</button>
                </div>
            ): (
                <div className="flex flex-col w-full mt-auto py-[2rem] px-[1.5rem]">
                    <button type="button" className="text-[1.125rem] leading-[2rem] font-semibold uppercase cursor-pointer text-white h-[48px] px-[3rem] bg-orange-600 rounded-[0.25rem]"><a href="/login">entre</a></button>
                    <a href="/cadastro" className="text-[1.125rem] leading-[2rem] font-semibold text-white mt-[1rem] text-center uppercase">Cadastre-se</a>
                </div>
            )}
        </aside>
    )
}

export default OpenMenu;