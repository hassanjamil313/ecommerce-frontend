import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Hide navbar on admin pages and profile page
    if (location.pathname.startsWith('/admin') || location.pathname === '/profile') {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">🛍️ E‑Commerce Store</Link>
            </div>
            <div className="navbar-links">
                <Link to="/">Home</Link>
                <Link to="/cart">Cart</Link>
                
                {user ? (
                    <>
                        {user.role === 'Admin' && <Link to="/admin">Admin</Link>}
                        <Link to="/wishlist">Wishlist</Link>   {/* Wishlist link for logged-in users */}
                        <div className="user-dropdown" ref={dropdownRef}>
                            <button
                                className="dropdown-toggle"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                aria-expanded={dropdownOpen}
                            >
                                <span className="welcome">Welcome, {user.firstName}!</span>
                                <span className="dropdown-arrow">▼</span>
                            </button>
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/profile" onClick={() => setDropdownOpen(false)}>
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-logout">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;