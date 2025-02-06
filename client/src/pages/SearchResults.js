import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

function SearchResults() {
    const [products, setProducts] = useState([]);
    const {departmentName, categoryName, subcategoryName } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('q');

    useEffect(() => {
        const fetchProducts = async () => {
            let url = '';
            if (departmentName && categoryName && subcategoryName) {
                url = `http://localhost:5000/api/products/${departmentName}/${categoryName}/${subcategoryName}`;
            } else if (departmentName && categoryName) {
                url = `http://localhost:5000/api/products/${departmentName}/${categoryName}`;
            } else if(departmentName) {
                url = `http://localhost:5000/api/products/${departmentName}`;
            } else {
                url = `http://localhost:5000/api/products?search=${query}`;
            }
            try {
                const response = await fetch(url);
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
            }
        };

        fetchProducts();
    }, [departmentName, categoryName, subcategoryName, query]);

    return (
        <div>
            {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product._id} product={product}/>
                    ))
                ) : (
                    <p>Nenhum produto encontrado.</p>
                )}
        </div>
    )
}

export default SearchResults;