import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchProduct = async() => {
            try {
                const response = await fetch(`http://localhost:5000/api/products/slug/${slug}`);
                if (!response.ok) {
                    throw new Error('Produto não encontrado');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) {
        return <div>Carregando...</div>;  // Exibe mensagem de carregamento
    }

  return (
    <div>
        {product.name}
        <p>{product.description}</p>
        <img src={`http://localhost:5000${product.image}`} alt={product.name} />
    </div>
  )
};

export default ProductPage;