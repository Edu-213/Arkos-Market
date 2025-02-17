import { useCallback } from 'react';

const useFormatCurrency = () => {
    const formatCurrency = useCallback(value => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }).format(value);
    }, []);

    return formatCurrency
};

export default useFormatCurrency;