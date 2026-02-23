import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FirstName: '',
        LastName: '',
        Email: '',
        Password: '',
        ConfirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                FirstName: user.firstName || '',
                LastName: user.lastName || '',
                Email: user.email || '',
                Password: '',
                ConfirmPassword: ''
            });
            setPreviewUrl(user.profilePicture || '');
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
        }
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Remove profile picture?')) return;
        try {
            setLoading(true);
            await API.delete('/users/profile/picture');
            // Update local user
            const updatedUser = { ...user, profilePicture: null };
            updateUser(updatedUser);
            setPreviewUrl('');
            setSelectedFile(null);
            setMessage('Profile picture removed');
        } catch (err) {
            console.error('Remove image error:', err);
            setError('Failed to remove image');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        if (formData.Password && formData.Password !== formData.ConfirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Update profile info
            const updateData = {};
            if (formData.FirstName !== user.firstName) updateData.FirstName = formData.FirstName;
            if (formData.LastName !== user.lastName) updateData.LastName = formData.LastName;
            if (formData.Email !== user.email) updateData.Email = formData.Email;
            if (formData.Password) updateData.Password = formData.Password;

            if (Object.keys(updateData).length > 0) {
                const { data } = await API.put('/users/profile', updateData);
                updateUser(data);
                setMessage('Profile updated successfully');
            }

            // Upload new profile picture if selected
            if (selectedFile) {
                setUploading(true);
                const formDataUpload = new FormData();
                formDataUpload.append('profilePic', selectedFile);
                const { data } = await API.post('/users/profile/picture', formDataUpload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                updateUser({ ...user, profilePicture: data.profilePicture });
                setMessage('Profile picture updated');
                setUploading(false);
            }
        } catch (err) {
            console.error('Profile update error:', err);
            setError(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
                <h2>My Profile</h2>
                {message && <div className="success-message">{message}</div>}
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="profile-picture-section">
                        <div className="avatar-preview">
                            <img src={previewUrl || 'https://via.placeholder.com/150'} alt="Profile" />
                        </div>
                        <div className="file-input">
                            <label>Change Profile Picture</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>
                        {user.profilePicture && (
                            <button type="button" className="remove-image-btn" onClick={handleRemoveImage} disabled={loading}>
                                <i className="fas fa-times"></i> Remove Image
                            </button>
                        )}
                    </div>

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            name="FirstName"
                            value={formData.FirstName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="LastName"
                            value={formData.LastName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <input
                            type="password"
                            name="ConfirmPassword"
                            value={formData.ConfirmPassword}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading || uploading}>
                        {loading || uploading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;