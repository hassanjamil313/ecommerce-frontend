import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // removed Link
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './Checkout.css';

const Checkout = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Credit Card');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchCart = async () => {
            try {
                const { data } = await API.get('/cart');
                if (data.length === 0) {
                    navigate('/cart');
                }
                setCartItems(data);
            } catch (error) {
                console.error('Error fetching cart:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [user, navigate]);

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + (item.Price * item.Quantity), 0).toFixed(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            const { data } = await API.post('/orders', {
                shippingAddress,
                paymentMethod
            });
            // Navigate to orders page after successful order
            navigate('/orders');
        } catch (error) {
            console.error('Order error:', error);
            setError(error.response?.data?.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Loading checkout...</div>;

    return (
        <div className="checkout-page">
            <h2>Checkout</h2>
            {error && <div className="error-message">{error}</div>}
            <div className="checkout-container">
                {/* Left column – Order summary */}
                <div className="summary-card">
                    <h3>Order Summary</h3>
                    <ul className="order-items">
                        {cartItems.map(item => (
                            <li key={item.ProductID} className="order-item">
                                <img src={item.ImageURL || 'https://via.placeholder.com/70'} alt={item.Name} />
                                <div className="item-details">
                                    <h4>{item.Name}</h4>
                                    <p>Qty: {item.Quantity} × ${item.Price}</p>
                                </div>
                                <div className="item-price">
                                    ${(item.Price * item.Quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="summary-total">
                        Total: ${calculateTotal()}
                    </div>
                </div>

                {/* Right column – Shipping & payment form */}
                <div className="form-card">
                    <h3>Shipping & Payment</h3>
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-group">
                            <label>Shipping Address</label>
                            <textarea
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                                rows="3"
                                placeholder="Enter your full address"
                            />
                        </div>
                        <div className="form-group">
                            <label>Payment Method</label>
                            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="Credit Card">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="Cash on Delivery">Cash on Delivery</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={submitting}>
                                {submitting ? 'Processing...' : 'Place Order'}
                            </button>
                            <button type="button" className="btn-secondary" onClick={() => navigate('/cart')}>
                                Back to Cart
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;