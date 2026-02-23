import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin/orders');
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        setUpdating(true);
        try {
            await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            // Update local state
            setOrders(orders.map(order =>
                order.OrderID === orderId ? { ...order, Status: newStatus } : order
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return '#f59e0b';
            case 'Processing': return '#3b82f6';
            case 'Shipped': return '#8b5cf6';
            case 'Delivered': return '#10b981';
            case 'Cancelled': return '#ef4444';
            default: return '#64748b';
        }
    };

    if (loading) return <div>Loading orders...</div>;

    return (
        <div className="admin-orders">
            <h2>Manage Orders</h2>
            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.OrderID}>
                                <td>#{order.OrderID}</td>
                                <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                <td>{order.FirstName} {order.LastName}<br/>{order.Email}</td>
                                <td>${order.TotalAmount}</td>
                                <td>
                                    <span style={{
                                        backgroundColor: getStatusColor(order.Status),
                                        color: 'white',
                                        padding: '0.2rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>
                                        {order.Status}
                                    </span>
                                </td>
                                <td>{order.PaymentMethod}<br/>{order.PaymentStatus}</td>
                                <td>
                                    <select
                                        value={order.Status}
                                        onChange={(e) => handleStatusChange(order.OrderID, e.target.value)}
                                        disabled={updating}
                                        className="status-select"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;