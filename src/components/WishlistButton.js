import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './WishlistButton.css';

const WishlistButton = ({ productId }) => {
    const { user } = useAuth();
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const checkStatus = async () => {
            try {
                const { data } = await API.get(`/wishlist/${productId}/status`);
                setInWishlist(data.inWishlist);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };
        checkStatus();
    }, [productId, user]);

    const handleToggle = async () => {
        if (!user) {
            // Redirect to login or show message
            alert('Please login to use wishlist');
            return;
        }
        setLoading(true);
        try {
            if (inWishlist) {
                await API.delete(`/wishlist/${productId}`);
                setInWishlist(false);
            } else {
                await API.post('/wishlist', { productId });
                setInWishlist(true);
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            alert('Failed to update wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            className={`wishlist-btn ${inWishlist ? 'in-wishlist' : ''}`}
            disabled={loading}
        >
            <i className={`fas fa-heart ${inWishlist ? 'fas' : 'far'}`}></i>
            {inWishlist ? ' Remove from Wishlist' : ' Add to Wishlist'}
        </button>
    );
};

export default WishlistButton;