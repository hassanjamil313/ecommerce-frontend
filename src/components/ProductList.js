import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import API, { fetchCategories } from '../services/api';
import './ProductList.css'; // make sure this file exists

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterLoading, setFilterLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Use a ref for the debounce timer instead of state
    const debounceTimer = useRef(null);

    // Load categories once
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const { data } = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Function to fetch products with current filters
    const fetchProducts = useCallback(async () => {
        setFilterLoading(true);
        try {
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory) params.category = selectedCategory;
            const { data } = await API.get('/products', { params });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setFilterLoading(false);
            setLoading(false);
        }
    }, [searchTerm, selectedCategory]);

    // Debounced effect: wait 300ms after last change before fetching
    useEffect(() => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(debounceTimer.current);
    }, [searchTerm, selectedCategory, fetchProducts]);

    // Initial load (on mount)
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClear = () => {
        setSearchTerm('');
        setSelectedCategory('');
        // fetchProducts will be called automatically by the debounce effect
    };

    if (loading) {
        return (
            <div className="container loading-spinner">
                <div className="spinner"></div>
                <p>Loading products...</p>
            </div>
        );
    }

    return (
        <div className="container product-list-page">
            <h2>Our Products</h2>

            {/* Filter Bar */}
            <div className="filter-bar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="category-wrapper">
                    <span className="category-icon">📁</span>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.CategoryID} value={cat.CategoryID}>
                                {cat.Name}
                            </option>
                        ))}
                    </select>
                </div>

                {(searchTerm || selectedCategory) && (
                    <button onClick={handleClear} className="clear-btn">
                        ✕ Clear Filters
                    </button>
                )}
            </div>

            {/* Loading overlay while filtering */}
            {filterLoading && (
                <div className="filter-loading">
                    <div className="spinner small"></div>
                    <span>Updating...</span>
                </div>
            )}

            {/* Product Grid */}
            {!filterLoading && products.length === 0 ? (
                <div className="empty-state">
                    <p>No products found. Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.map(product => (
                        <Link to={`/product/${product.ProductID}`} key={product.ProductID} className="product-card-link">
                            <div className="product-card">
                                <div className="product-image">
                                    <img src={product.ImageURL || 'https://via.placeholder.com/300'} alt={product.Name} />
                                </div>
                                <div className="product-info">
                                    <h3>{product.Name}</h3>
                                    <p className="product-description">{product.Description}</p>
                                    <p className="product-price">${product.Price}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;