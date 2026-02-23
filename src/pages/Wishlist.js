import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getWishlist, removeFromWishlist, addToCart } from '../services/api'; // addToCart from cart API
import './Wishlist.css';

const Wishlist = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;
        fetchWishlist();
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const { data } = await getWishlist();
            setItems(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId);
            setItems(items.filter(item => item.ProductID !== productId));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            await addToCart({ productId, quantity: 1 }); // adjust as needed
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (!user) {
        return (
            <div className="container empty-wishlist">
                <h2>Wishlist</h2>
                <p>Please <Link to="/login">login</Link> to view your wishlist.</p>
            </div>
        );
    }

    if (loading) return <div className="container loading">Loading wishlist...</div>;

    if (items.length === 0) {
        return (
            <div className="container empty-wishlist">
                <h2>Wishlist</h2>
                <p>Your wishlist is empty. <Link to="/">Continue shopping</Link></p>
            </div>
        );
    }

    return (
        <div className="container wishlist-page">
            <h2>Wishlist</h2>
            <div className="wishlist-grid">
                {items.map(item => (
                    <div key={item.WishlistID} className="wishlist-card">
                        <Link to={`/product/${item.ProductID}`}>
                            <img src={item.ImageURL || 'https://via.placeholder.com/200'} alt={item.Name} />
                        </Link>
                        <div className="wishlist-info">
                            <h3>{item.Name}</h3>
                            <p className="price">${item.Price}</p>
                            <div className="wishlist-actions">
                                <button onClick={() => handleAddToCart(item.ProductID)} className="btn-primary small">
                                    Add to Cart
                                </button>
                                <button onClick={() => handleRemove(item.ProductID)} className="btn-remove">
                                    <i className="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;