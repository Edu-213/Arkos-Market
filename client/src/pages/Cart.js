import React, { useEffect, useState } from 'react';
import CartItem from '../components/cartComponents/CartItem';
import ResumeCart from '../components/cartComponents/ResumeCart';
import useIsMobile from '../hooks/useIsMobile';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {cart, loading, updateQuantity, removeItem, clearCart} = useCart();
  const [errorMessage, setErrorMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const isMobile = useIsMobile(768);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 300000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (loading) return <p>Carregando carrinho...</p>;

  return (
    <div className="container mx-auto">
      {errorMessage && (
        <div>
          <ol className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-red-700 text-white rounded shadow-lg z-50 max-w-[90%] w-max text-center">
            <li className="py-[0.75rem] px-[2rem] leading-[1.125rem]">{errorMessage}</li>
          </ol>
        </div>
      )}

      {isMobile && (
        <div className="bg-white flex py-5 px-5 md:w-[522px] mt-[10px]">
          <div className="w-full">
            <p className="font-bold leading-[24px] text-mutedgray mb-[16px]">Frete e Prazos:</p>
            <div className="flex">
              <div className="relative w-full">
                <input
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <label
                  className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${
                    inputValue ? 'top-0 text-xs text-blue-500' : 'top-2.5 text-base'
                  } peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}
                >
                  CEP*
                </label>
              </div>
              <button className="ml-3 bg-[#0060B1] text-white font-bold py-[10px] px-5 rounded-[4px] leading-[20px] uppercase">CALCULAR</button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10">
        {cart && cart.items.length > 0 ? (
          <div className="flex flex-col">
            <div className="flex">
              <div className="bg-white md:px-[2rem] px-[1rem] py-[1rem]">
                <div className="flex justify-between">
                  <p className="font-bold text-gunmetal leading-[1.5rem]">Meu carrinho</p>
                  <button
                    className="flex items-center gap-[0.2rem] px-[1rem] py-[0.5rem] border border-red-500 font-bold text-[#D5041A] text-xs rounded-[4px]"
                    onClick={() => clearCart()}
                  >
                    <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="https://www.w3.org/2000/svg" className="w-[1rem] h-[1rem]" aria-hidden="true">
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16.6154 4H22.1538C23.2615 4 24 4.8 24 6V8H0V6C0 4.8 0.923077 4 1.84615 4H7.38462C7.75385 1.8 9.78461 0 12 0C14.2154 0 16.2462 1.8 16.6154 4ZM9.23077 4H14.7692C14.4 2.8 13.1077 2 12 2C10.8923 2 9.6 2.8 9.23077 4ZM1.84615 10H22.1538L20.4923 30.2C20.4923 31.2 19.5692 32 18.6462 32H5.35385C4.43077 32 3.69231 31.2 3.50769 30.2L1.84615 10Z"
                        fill="#D5041A"
                      ></path>
                    </svg>
                    Remover todos
                  </button>
                </div>
                <div className="flex flex-col w-full">
                  {cart.items.map(item => (
                    <CartItem
                      key={item.product._id}
                      item={item}
                      removeFromCart={() => removeItem(item.product._id)}
                      updateQuantity={newQuantity => updateQuantity(item.product._id, newQuantity)}
                      setErrorMessage={setErrorMessage}
                    />
                  ))}
                </div>
              </div>

              <div className="md:ml-[32px] z-20">
                <ResumeCart cart={cart} />
              </div>
              
            </div>

            <div className="md:flex md:justify-between md:max-w-[1200px] md:mt-[64px] mt-[20px] mb-[20px] md:mb-0">
              <div className="bg-white flex py-5 px-5 md:w-[522px]">
                <div className="w-full">
                  <p className="font-bold leading-[24px] text-mutedgray mb-[16px]">Cupom de desconto:</p>
                  <div className="flex">
                    <div className="relative w-full">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <label
                        className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${
                          inputValue ? 'top-0 text-xs text-blue-500' : 'top-2.5 text-base'
                        } peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}
                      >
                        Cupom
                      </label>
                    </div>
                    <button className="ml-3 bg-[#0060B1] text-white font-bold py-[10px] px-5 rounded-[4px] leading-[20px] uppercase">Aplicar</button>
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="bg-white flex py-5 px-5 md:w-[522px]">
                  <div className="w-full">
                    <p className="font-bold leading-[24px] text-mutedgray mb-[16px]">Frete e Prazos:</p>
                    <div className="flex">
                      <div className="relative w-full">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={e => setInputValue(e.target.value)}
                          className="peer block w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <label
                          className={`absolute left-3 text-gray-500 transition-all duration-200 transform ${
                            inputValue ? 'top-0 text-xs text-blue-500' : 'top-2.5 text-base'
                          } peer-focus:top-0 peer-focus:text-xs peer-focus:text-blue-500`}
                        >
                          CEP*
                        </label>
                      </div>
                      <button className="ml-3 bg-[#0060B1] text-white font-bold py-[10px] px-5 rounded-[4px] leading-[20px] uppercase">CALCULAR</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <p>
            Seu carrinho está vazio.{' '}
            <a href="/" className="text-blue-500 underline">
              Voltar ao catálogo
            </a>
          </p>
        )}
      </div>
      <div></div>
    </div>
  );
};

export default Cart;
