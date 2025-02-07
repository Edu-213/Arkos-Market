import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        const fetchProducts = async() => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch(error) {
                console.error('Erro ao carregar os produtos:', error);
            }
        };
        fetchProducts();
    }, []);

    return(
        <div>
            <h2>Catálogo de Produtos</h2>
            <div className='flex flex-col'>
                {products.map((product) => (
                    <div>
                        <ProductCard key={product._id} product={product}/>
                    </div>
                ))}
                
            </div>
        </div>
    );
};

export default Catalog;