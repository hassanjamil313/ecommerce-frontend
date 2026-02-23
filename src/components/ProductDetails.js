import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import WishlistButton from './WishlistButton';
import './ProductDetails.css'; // optional – if you have a separate CSS file

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await API.get(`/products/${id}`);
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await API.post('/cart', { productId: id, quantity });
            alert('Product added to cart!');
            navigate('/cart');
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add to cart');
        }
    };

    if (loading) return <div className="container loading">Loading product...</div>;
    if (!product) return <div className="container">Product not found</div>;

    return (
        <div className="container product-details">
            <div className="product-details-grid">
                <div className="product-image">
                    <img src={product.ImageURL || 'https://via.placeholder.com/500'} alt={product.Name} />
                </div>
                <div className="product-info">
                    <h1>{product.Name}</h1>
                    <p className="product-price">${product.Price}</p>
                    <p className="product-description">{product.Description}</p>
                    <div className="product-meta">
                        <p><strong>Category:</strong> {product.CategoryName}</p>
                        <p><strong>Stock:</strong> {product.Stock} units available</p>
                    </div>
                    <div className="quantity-selector">
                        <label>Quantity:</label>
                        <input
                            type="number"
                            min="1"
                            max={product.Stock}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <div className="product-actions">
                        <button className="btn-primary" onClick={addToCart}>
                            <i className="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <WishlistButton productId={product.ProductID} />
                        <button className="btn-secondary" onClick={() => navigate(-1)}>
                            <i className="fas fa-arrow-left"></i> Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;