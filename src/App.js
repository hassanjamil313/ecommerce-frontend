import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductDetails from './components/ProductDetails';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import OrderDetails from './components/OrderDetails';
import Footer from './components/Footer';
import AdminUsers from './pages/AdminUsers';


// Admin imports
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminRoute from './components/AdminRoute';
import AdminOrders from './pages/AdminOrders';
import AdminDashboardHome from './pages/AdminDashboardHome';
import AdminCategories from './pages/AdminCategories';
import ProfilePage from './pages/ProfilePage';

import './App.css';

function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="/profile" element={<ProfilePage />} />
                
                

                {/* Admin routes (protected) */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }>
                   
                    <Route index element={<AdminDashboardHome />} />
                    <Route path="products" element={<AdminProducts />} />
                    <Route path="orders" element={<AdminOrders />} />
                    <Route path="users" element={<AdminUsers/>} />
                     <Route path="categories" element={<AdminCategories />} />
                </Route>

                {/* 404 - Not Found */}
                <Route path="*" element={<div className="container"><h2>404 - Page Not Found</h2></div>} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;