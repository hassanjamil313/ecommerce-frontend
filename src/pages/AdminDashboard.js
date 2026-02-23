import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="admin-dashboard">
            <aside className="admin-sidebar">
                <div className="sidebar-content">
                    <h2>Admin Panel</h2>
                    <div className="welcome-message">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="sidebar-avatar" />
                        ) : (
                            <i className="fas fa-user-circle"></i>
                        )}
                        <span>Welcome, {user?.firstName}!</span>
                    </div>
                    <nav>
                        <ul>
                            <li><Link to="/admin"><i className="fas fa-tachometer-alt"></i> Dashboard Home</Link></li>
                            <li><Link to="/admin/products"><i className="fas fa-box"></i> Manage Products</Link></li>
                            <li><Link to="/admin/categories"><i className="fas fa-tags"></i> Manage Categories</Link></li>
                            <li><Link to="/admin/orders"><i className="fas fa-shopping-cart"></i> Manage Orders</Link></li>
                            <li><Link to="/admin/users"><i className="fas fa-users"></i> Manage Users</Link></li>
                            <li><Link to="/profile"><i className="fas fa-id-card"></i> My Profile</Link></li>
                        </ul>
                    </nav>
                </div>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
            </aside>
            <main className="admin-content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminDashboard;