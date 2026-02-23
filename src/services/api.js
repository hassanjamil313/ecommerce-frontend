import axios from 'axios';
export const addToWishlist = (productId) => API.post('/wishlist', { productId });
export const removeFromWishlist = (productId) => API.delete(`/wishlist/${productId}`);
export const getWishlist = () => API.get('/wishlist');
export const checkWishlistStatus = (productId) => API.get(`/wishlist/${productId}/status`);

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api'
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Export the configured Axios instance and helper functions
export const fetchCategories = () => API.get('/categories');

export default API;