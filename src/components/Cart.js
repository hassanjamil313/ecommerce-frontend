import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './Cart.css';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        const fetchCart = async () => {
            try {
                const { data } = await API.get('/cart');
                setCartItems(data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user]);

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await API.put(`/cart/${productId}`, { quantity: newQuantity });
            const { data } = await API.get('/cart');
            setCartItems(data);
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            await API.delete(`/cart/${productId}`);
            setCartItems(cartItems.filter(item => item.ProductID !== productId));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0).toFixed(2);
    };

    if (!user) {
        return (
            <div className="container empty-cart">
                <h2>Your Cart</h2>
                <p>Please <Link to="/login">login</Link> to view your cart.</p>
            </div>
        );
    }

    if (loading) return <div className="container">Loading cart...</div>;

    if (cartItems.length === 0) {
        return (
            <div className="container empty-cart">
                <h2>Your Cart</h2>
                <p>Your cart is empty. <Link to="/">Continue shopping</Link></p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>Your Cart</h2>
            <div>
                {cartItems.map(item => (
                    <div key={item.ProductID} className="cart-item">
                        <img src={item.ImageURL || 'https://via.placeholder.com/120'} alt={item.Name} />
                        <div className="cart-item-details">
                            <h3>{item.Name}</h3>
                            <p className="cart-item-price">${item.Price}</p>
                            <div className="cart-item-actions">
                                <button onClick={() => updateQuantity(item.ProductID, item.Quantity - 1)}>-</button>
                                <span>{item.Quantity}</span>
                                <button onClick={() => updateQuantity(item.ProductID, item.Quantity + 1)}>+</button>
                                <button className="remove-btn" onClick={() => removeItem(item.ProductID)}>Remove</button>
                            </div>
                        </div>
                        <div className="cart-item-total">
                            <strong>Total: ${(item.Price * item.Quantity).toFixed(2)}</strong>
                        </div>
                    </div>
                ))}
            </div>
            <div className="cart-summary">
                <h3>Grand Total: ${calculateTotal()}</h3>
                <Link to="/checkout">
                    <button className="checkout-btn">Proceed to Checkout</button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;