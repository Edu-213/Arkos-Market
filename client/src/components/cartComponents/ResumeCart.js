import React, { useState } from 'react';
import useIsMobile from '../../hooks/useIsMobile';
import useFormatCurrency from '../../hooks/useFormatCurrency';

const ResumeCart = ({ cart }) => {
  const formatCurrency = useFormatCurrency();
  const isMobile = useIsMobile(768);
  const [isOpen, setIsOpen] = useState(false);

  const totalPrice = cart.items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0);
  const totalPix = cart.items.reduce((total, item) => total + item.product.finalPriceWithPix * item.quantity, 0);

  //Maior número de parcelas disponíveis no carrinho
  const maxInstallments = cart.items.reduce((max, item) => Math.max(max, item.product.maxInstallments), 0);

  const installmentValue = maxInstallments > 0 ? totalPrice / maxInstallments : totalPrice;

  return (
    <div className={`fixed bottom-0 left-0 w-full md:static transition-all duration-300 ${isMobile ? 'shadow-[0px_-10px_7px_rgba(0,0,0,0.1)]' : 'shadow-none'}`}>
      <div className="py-5 px-5 bg-white">
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-t-full flex items-center justify-center"
          >
            <svg
              width="13"
              height="8"
              viewBox="0 0 13 8"
              fill="none"
              xmlns="https://www.w3.org/2000/svg"
              aria-hidden="true"
              className={`transition-transform duration-500 ${isOpen ? 'rotate-180' : '0'}`}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0459 1.54599L10.955 0.455078L6.0459 5.36417L1.13681 0.455078L0.0458984 1.54599L6.0459 7.54599L12.0459 1.54599Z"
                fill="#000"
                aria-hidden="true"
              ></path>
            </svg>
          </button>
        )}
        <div className={`${isMobile ? 'flex justify-between' : 'block'}`}>
          <p className="text-gunmetal font-bold leading-[1.5rem]">Resumo do pedido</p>
          {isMobile && (
            <p className="leading-[18px] text-mutedgray uppercase font-semibold text-sm">
              valor no pix: <span className="font-bold">{formatCurrency(totalPix)}</span>
            </p>
          )}
        </div>
        <div className={`md:flex flex-col ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex justify-between py-[12px] px-[4px] border-b border-[#DEE0E4]">
            <p className="cts text-xs ">Valor dos produtos:</p>
            <p className="text-mutedgray font-bold text-sm leading-[18px]">{formatCurrency(totalPrice)}</p>
          </div>
          <div className="flex justify-between py-[12px] px-[4px] border-b border-[#DEE0E4]">
            <p className="cts text-xs ">Frete:</p>
            <p className="text-mutedgray font-bold text-sm leading-[18px]">{formatCurrency(0)}</p>
          </div>
          <div className="flex justify-between py-[12px] px-[4px]">
            <p className="text-[#00A202] leading-[1rem] text-xs font-semibold">Valor à vista:</p>
            <p className="text-[#00A202] font-bold text-sm leading-[20px]">{formatCurrency(totalPix)}</p>
          </div>
          <div className="flex justify-between py-[12px] px-[4px] ">
            <p className="cts text-xs font-semibold whitespace-nowrap">Total a prazo:</p>
            <div className="text-right">
              <p className="text-[#FF0000] font-bold text-sm leading-[20px]">
                {formatCurrency(cart.items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0))}
              </p>
              <p className="text-xs text-gunmetal leading-[1rem]">
                (em até <span className="font-bold">{maxInstallments}x</span> de <span className="font-semibold">{formatCurrency(installmentValue)}</span> sem juros)
              </p>
            </div>
          </div>
        </div>
        {isMobile && <button className="w-full bg-[#009E2A] text-white font-bold py-[10px] px-[1rem] mt-[13px] rounded-[4px] uppercase">IR PARA O PAGAMENTO</button>}
      </div>
      {!isMobile && (
        <div className="mt-[43px] bg-white px-5 py-[10px] flex flex-col gap-[0.3rem]">
          <button className="w-full bg-[#009E2A] text-white font-bold py-[10px] px-[1rem] rounded-[4px] uppercase">IR PARA O PAGAMENTO</button>
          <button className="w-full text-[#009E2A] font-bold py-[10px] px-[1rem] rounded-[4px] uppercase">
            <a href="/">continuar comprando</a>
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeCart;
