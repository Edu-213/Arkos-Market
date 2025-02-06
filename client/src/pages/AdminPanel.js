import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        brand: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        maxInstallments: 1,
        maxPurchaseLimit: 1,
        pixDiscount: 0,
        discount: 0,
    });

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        discount: 0,
    });

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async() => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            setProducts(response.data);
        } catch(error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/category');
            setCategories(response.data);
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setForm({...form, [name]: value});
    };

    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategoryForm({ ...categoryForm, [name]: value });
    };

    const handleFileChange = (e) => {
        setForm({...form, image: e.target.files[0]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('brand', form.brand);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('category', form.category);
        formData.append('stock', form.stock);
        formData.append('maxInstallments', form.maxInstallments);
        formData.append('maxPurchaseLimit', form.maxPurchaseLimit);
        formData.append('pixDiscount', form.pixDiscount);
        if (form.image) {
            formData.append('image', form.image);
        }
        try {
            await axios.post('http://localhost:5000/api/products', formData, {
                headers: {'Content-Type': 'multipart/form-data'},
            });
            fetchProducts();
            setForm({
                name: '',
                brand: '',
                description: '',
                price: 0,
                category: '',
                stock: 0,
                maxInstallments: 1,
                maxPurchaseLimit: 1,
                pixDiscount: 0,
                image: null,
            });
        } catch(error) {
            console.error('Erro ao criar produto:', error);
        }
    };

    const handleSubmitCategory = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/admin/category', categoryForm);
            fetchCategories();
            setCategoryForm({ name: '', discount: 0 });
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
        }
    };

    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/category/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Erro ao deletar categoria:', error);
        }
    };

    const handleDelete = async(id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/id/${id}`);
            fetchProducts();
        } catch(error) {
            console.error('Erro ao deletar produto:', error);
        }
    };

    return(
        <div>
            <h1>Painel Administrativo</h1>
            {/* Formulário de Categorias */}
            <h2>Gerenciar Categorias</h2>
            <form onSubmit={handleSubmitCategory}>
                <input
                    type="text"
                    name="name"
                    value={categoryForm.name}
                    onChange={handleCategoryChange}
                    placeholder="Nome da Categoria"
                    required
                />
                <input
                    type="number"
                    name="discount"
                    value={categoryForm.discount}
                    onChange={handleCategoryChange}
                    placeholder="Desconto (%)"
                />
                <button type="submit">Adicionar Categoria</button>
            </form>

            <h3>Categorias</h3>
            <ul>
                {categories.map((category) => (
                    <li key={category._id}>
                        {category.name} (Desconto: {category.discount}%){' '}
                        <button onClick={() => handleDeleteCategory(category._id)}>Deletar</button>
                    </li>
                ))}
            </ul>

            {/* Formulário de Produtos */}

            <form onSubmit={handleSubmit}>
                <input type="file" name="image" onChange={handleFileChange} accept="image/*" required />
                <input type="text" name="name" value={form.name} onChange={handleInputChange} placeholder="Nome do produto" required />
                <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Descrição"></textarea>
                <input type="number" name="price" value={form.price} onChange={handleInputChange} placeholder="Preço" required />
                <select name="category" value={form.category} onChange={handleInputChange} required>
                    <option value="" disabled>Selecione uma categoria</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name} (Desconto: {category.discount}%)
                        </option>
                    ))}
                </select>
                <input type="number" name="maxInstallments" value={form.maxInstallments} onChange={handleInputChange} placeholder="Número máximo de parcelas" required/>
                <input type="number" name="stock" value={form.stock} onChange={handleInputChange} placeholder="Estoque" />
                <input type="text" name="brand" value={form.brand} onChange={handleInputChange} placeholder="Marca do produto" required/> 
                <input type="number" name="maxPurchaseLimit" value={form.maxPurchaseLimit} onChange={handleInputChange} placeholder="Máximo permitido por compra" min="1" required/>
                <input type="number" name="pixDiscount" value={form.pixDiscount} onChange={handleInputChange} placeholder="Desconto pix" min="0"/>
                <button type="submit">Adicionar Produto</button>
            </form>

            <h2>Produtos</h2>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <img src={`/uploads/${product.image}`} alt={product.name} style={{ width: '100px', height: '100px' }} />
                        {product.name} - {product.price} (Estoque: {product.stock}){' '}
                        <button onClick={() => handleDelete(product._id)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;