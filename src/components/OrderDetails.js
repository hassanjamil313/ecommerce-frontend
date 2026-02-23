import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        const fetchOrder = async () => {
            try {
                const { data } = await API.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, user, navigate]);

    if (loading) return <div className="container">Loading order details...</div>;
    if (!order) return <div className="container">Order not found.</div>;

    return (
        <div className="container">
            <h2>Order #{order.OrderID}</h2>
            <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                    <div>
                        <p><strong>Order Date:</strong> {new Date(order.OrderDate).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span style={{ color: order.Status === 'Pending' ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{order.Status}</span></p>
                        <p><strong>Shipping Address:</strong> {order.ShippingAddress}</p>
                        <p><strong>Payment Method:</strong> {order.PaymentMethod}</p>
                    </div>
                    <div>
                        <p><strong>Payment Status:</strong> {order.PaymentStatus || 'Pending'}</p>
                        <p><strong>Total Amount:</strong> ${order.TotalAmount}</p>
                    </div>
                </div>
                <h3>Items</h3>
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '1rem', paddingTop: '1rem' }}>
                    {order.items.map(item => (
                        <div key={item.OrderItemID} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <img src={item.ImageURL || 'https://via.placeholder.com/80'} alt={item.ProductName} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                            <div style={{ flex: 1 }}>
                                <h4>{item.ProductName}</h4>
                                <p>SKU: {item.ProductSKU}</p>
                                <p>Quantity: {item.Quantity} × ${item.Price}</p>
                            </div>
                            <p><strong>${(item.Price * item.Quantity).toFixed(2)}</strong></p>
                        </div>
                    ))}
                </div>
                <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                    <button onClick={() => navigate('/orders')} className="btn-secondary">Back to Orders</button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;