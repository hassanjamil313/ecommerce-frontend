import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './AdminDashboardHome.css';

const AdminDashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await API.get('/admin/dashboard/stats');
            setStats(data);
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading dashboard...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="admin-dashboard-home">
            <h1>Dashboard Overview</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                </div>
            </div>

            <div className="recent-orders">
                <h2>Recent Orders</h2>
                <table className="recent-orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.recentOrders.map(order => (
                            <tr key={order.OrderID}>
                                <td>#{order.OrderID}</td>
                                <td>{order.FirstName} {order.LastName}<br/>{order.Email}</td>
                                <td>{new Date(order.OrderDate).toLocaleDateString()}</td>
                                <td>${order.TotalAmount}</td>
                                <td>
                                    <span className={`status-badge status-${order.Status.toLowerCase()}`}>
                                        {order.Status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h2>Orders by Status</h2>
                    <div className="status-list">
                        {stats.ordersByStatus.map(item => (
                            <div key={item.Status} className="status-item">
                                <span className="status-label">{item.Status}</span>
                                <span className="status-count">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Monthly Sales (Last 6 Months)</h2>
                    <div className="monthly-sales">
                        {stats.monthlySales.map(item => (
                            <div key={`${item.year}-${item.month}`} className="sales-item">
                                <span className="month">{item.year}-{item.month}</span>
                                <span className="amount">${item.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardHome;