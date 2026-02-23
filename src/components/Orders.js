import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            return;
        }
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/orders');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    if (!user) {
        return (
            <div className="container empty-cart">
                <h2>My Orders</h2>
                <p>Please <Link to="/login">login</Link> to view your orders.</p>
            </div>
        );
    }

    if (loading) return <div className="container">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="container empty-cart">
                <h2>My Orders</h2>
                <p>You haven't placed any orders yet. <Link to="/">Start shopping</Link></p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>My Orders</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map(order => (
                    <div key={order.OrderID} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                            <div>
                                <h3>Order #{order.OrderID}</h3>
                                <p>Date: {new Date(order.OrderDate).toLocaleDateString()}</p>
                                <p>Status: <span style={{ color: order.Status === 'Pending' ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>{order.Status}</span></p>
                            </div>
                            <div>
                                <p><strong>Total: ${order.TotalAmount}</strong></p>
                                <Link to={`/orders/${order.OrderID}`}>
                                    <button className="btn-secondary" style={{ padding: '0.5rem 1rem' }}>View Details</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;