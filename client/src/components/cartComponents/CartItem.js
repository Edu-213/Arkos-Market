import React from 'react';
import useIsMobile from '../../hooks/useIsMobile';

const formatCurrency = value => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

const CartItem = React.memo(({ item, removeFromCart, updateQuantity, setErrorMessage }) => {
  const isMobile = useIsMobile(768);

  const handleQuantityChange = e => {
    let newQuantity = Number(e.target.value);

    if (newQuantity > item.product.maxPurchesedLimit) {
      setErrorMessage(`O limite máximo de quantidade para esse produto é ${item.product.maxPurchesedLimit}`);
      newQuantity = item.product.maxPurchesedLimit;
    }

    if (newQuantity < 1) {
      newQuantity = 1;
    }

    updateQuantity(newQuantity);
  };

  return (
    <div>
      <div>
        {isMobile ? (
          <div className="flex flex-col gap-[0.5rem] p-[1rem]">
            <div className="flex items-start">
              <a href="/" className="w-[5.5rem] h-[5.5rem] flex items-center justify-center">
                {item.product.image && (
                  <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} className="object-contain h-auto w-auto " draggable="false" />
                )}
              </a>
              <div className="flex flex-col gap-[0.25rem] ml-[0.25rem] mr-auto">
                <div className="flex flex-col items-start gap-[0.25rem]">
                  <span className="text-[0.75rem] leading-[1.125rem] text-gray-500">{item.product.brand}</span>
                  <a href="/" className="text-xs font-bold leading-[1rem] text-gray-800 hover:underline line-clamp-2 overflow-hidden text-ellipsis">
                    {item.product.name}
                  </a>
                </div>
              </div>
              <button className="uppercase font-bold justify-center items-center" type="button" onClick={removeFromCart}>
                <span className="text-xs text-red-600 text-xs items-center">
                  {' '}
                  <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="https://www.w3.org/2000/svg" className="w-[1rem] h-[1rem]" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M16.6154 4H22.1538C23.2615 4 24 4.8 24 6V8H0V6C0 4.8 0.923077 4 1.84615 4H7.38462C7.75385 1.8 9.78461 0 12 0C14.2154 0 16.2462 1.8 16.6154 4ZM9.23077 4H14.7692C14.4 2.8 13.1077 2 12 2C10.8923 2 9.6 2.8 9.23077 4ZM1.84615 10H22.1538L20.4923 30.2C20.4923 31.2 19.5692 32 18.6462 32H5.35385C4.43077 32 3.69231 31.2 3.50769 30.2L1.84615 10Z"
                      fill="#D5041A"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
            <div className="flex justify-between gap-[0.5rem] item-start">
              <div>
                <p className="text-[0.625rem] leading-[1rem] text-gray-600">
                  Com desconto no PIX: <b>{formatCurrency(item.product.finalPriceWithPix)}</b>
                </p>
                <p className="text-[0.625rem] leading-[1rem] text-gray-600">
                  Parcelado no cartão sem juros: <b>{formatCurrency(item.product.finalPrice)}</b>
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-[0.5rem] items-start">
              <div className="flex flex-col gap-[0.5rem] text-left">
                <p className="text-xs leading-[1.125rem] text-gray-600">Preço à vista no PIX:</p>
                <p className="text-base font-bold text-blue-600 leading-[1.75rem]">
                  {formatCurrency((item.product.finalPriceWithPix || item.product.finalPrice) * item.quantity)}
                </p>
              </div>
              <div className="grid grid-cols-[1fr,auto,1fr] gap-[0.25rem] items-end">
                <button onClick={() => updateQuantity(item.quantity - 1)} disabled={item.quantity <= 1}>
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.91673 14L9.18945 12.7273L3.46218 7L9.18945 1.27273L7.91673 0L0.916725 7L7.91673 14Z"
                      className={item.quantity <= 1 ? 'fill-gray-400' : 'fill-blue-600'}
                    ></path>
                  </svg>
                </button>
                <div className="flex flex-col justify-center items-center gap-[0.5rem]">
                  <label>
                    <span className="text-gray-500 items-center text-xs">Quant.</span>
                  </label>
                  <input
                    value={item.quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={item.product.maxPurchesedLimit}
                    className="leading-[1.75rem] font-bold text-center flex max-w-[2.875rem] text-base"
                  />
                </div>
                <button onClick={() => updateQuantity(item.quantity + 1)} disabled={item.quantity >= item.product.maxPurchesedLimit}>
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="https://www.w3.org/2000/svg" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.18972 14L0.916992 12.7273L6.64427 7L0.916992 1.27273L2.18972 0L9.18972 7L2.18972 14Z"
                      className={item.quantity >= item.product.maxPurchesedLimit ? 'fill-gray-400' : 'fill-blue-600'}
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-[5.5rem,2fr,1fr] gap-[1rem] py-[1rem]">
            <a href="/" className="w-[5.5rem] h-[5.5rem] flex items-center justify-center">
              {item.product.image && (
                <img src={`http://localhost:5000${item.product.image}`} alt={item.product.name} className="object-contain h-auto w-full " draggable="false" />
              )}
            </a>
            <div className="flex flex-col">
              <div className="flex flex-col justify-start">
                <span className='text-[0.75rem] font-normal leading-[1.125rem] text-gray-500'>{item.product.brand}</span>
                <a href="/" className="text-sm font-bold leading-[1.125rem] text-gray-800 hover:underline line-clamp-2 overflow-hidden text-ellipsis">
                  {item.product.name}
                </a>
              </div>
            </div>
            <div className="flex flex-row justify-between w-full">
              <div>
                <div>quantidade</div>
                <button type="button">remove</button>
              </div>
              <div>
                <div>
                  <p>Preço</p>
                  <p>valor</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    /*
        <div
                    key={item.product._id}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-lg"
                    >
                    <div className="flex items-center">
                        <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                        <h2 className="text-lg font-semibold">{item.product.name}</h2>
                        <p className="text-gray-500">R$ {item.product.price}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        onChange={(e) => updateQuantity(e)}
                        className="w-16 border rounded-lg text-center"
                        />
                        <button
                        onClick={removeFromCart}
                        className="text-red-500 hover:underline"
                        >
                        Remover
                        </button>
                    </div>
                    </div>
                    */
  );
});

export default CartItem;
