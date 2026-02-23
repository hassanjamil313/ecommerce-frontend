import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        CategoryID: '',
        SKU: '',
        Name: '',
        Description: '',
        Price: '',
        Stock: '',
        ImageURL: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/products');
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await API.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const fileReader = new FileReader();
            fileReader.onload = () => setPreviewUrl(fileReader.result);
            fileReader.readAsDataURL(file);
            setFormData(prev => ({ ...prev, ImageURL: '' }));
        } else {
            setSelectedFile(null);
            setPreviewUrl('');
        }
    };

    const uploadImage = async () => {
        if (!selectedFile) return formData.ImageURL;

        const formDataUpload = new FormData();
        formDataUpload.append('image', selectedFile);

        try {
            setUploading(true);
            const { data } = await API.post('/upload', formDataUpload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return data.imageUrl;
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Image upload failed. Please try again.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, ImageURL: '' }));
        setSelectedFile(null);
        setPreviewUrl('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = formData.ImageURL;
        if (selectedFile) {
            const uploadedUrl = await uploadImage();
            if (!uploadedUrl) return;
            imageUrl = uploadedUrl;
        }

        const productData = {
            CategoryID: parseInt(formData.CategoryID),
            SKU: formData.SKU || null,
            Name: formData.Name,
            Description: formData.Description,
            Price: parseFloat(formData.Price),
            Stock: parseInt(formData.Stock),
            ImageURL: imageUrl || null
        };

        try {
            if (editingProduct) {
                await API.put(`/products/${editingProduct.ProductID}`, productData);
            } else {
                await API.post('/products', productData);
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
            const errorMsg = error.response?.data?.message || 'Failed to save product';
            alert(errorMsg);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            CategoryID: product.CategoryID || '',
            SKU: product.SKU || '',
            Name: product.Name || '',
            Description: product.Description || '',
            Price: product.Price || '',
            Stock: product.Stock || '',
            ImageURL: product.ImageURL || ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setShowForm(true);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await API.delete(`/products/${productId}`);
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Failed to delete product');
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            CategoryID: '',
            SKU: '',
            Name: '',
            Description: '',
            Price: '',
            Stock: '',
            ImageURL: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setShowForm(false);
    };

    const handleAddNewClick = () => {
        resetForm();       // clear any previous data
        setShowForm(true); // open the form
    };

    if (loading) return <div className="loading">Loading products...</div>;

    return (
        <div className="admin-products">
            <div className="admin-header">
                <h2>Manage Products</h2>
                <button className="btn-primary" onClick={handleAddNewClick}>
                    <i className="fas fa-plus"></i> {showForm ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="product-form">
                    <h3>{editingProduct ? 'Edit Product' : 'New Product'}</h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Category *</label>
                            <select
                                name="CategoryID"
                                value={formData.CategoryID}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.CategoryID} value={cat.CategoryID}>
                                        {cat.Name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>SKU (optional)</label>
                            <input
                                type="text"
                                name="SKU"
                                value={formData.SKU}
                                onChange={handleInputChange}
                                placeholder="e.g. SKU001"
                            />
                        </div>

                        <div className="form-group">
                            <label>Name *</label>
                            <input
                                type="text"
                                name="Name"
                                value={formData.Name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="Description"
                                value={formData.Description}
                                onChange={handleInputChange}
                                rows="2"
                            />
                        </div>

                        <div className="form-group">
                            <label>Price *</label>
                            <input
                                type="number"
                                step="0.01"
                                name="Price"
                                value={formData.Price}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock *</label>
                            <input
                                type="number"
                                name="Stock"
                                value={formData.Stock}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {previewUrl && (
                                <div className="image-preview-container">
                                    <img src={previewUrl} alt="Preview" className="image-preview" />
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={handleRemoveImage}
                                    >
                                        <i className="fas fa-times"></i> Remove
                                    </button>
                                </div>
                            )}
                            {formData.ImageURL && !previewUrl && (
                                <div className="image-preview-container">
                                    <img src={formData.ImageURL} alt="Current" className="image-preview" />
                                    <p className="image-current-note">Current image</p>
                                    <button
                                        type="button"
                                        className="btn-remove-image"
                                        onClick={handleRemoveImage}
                                    >
                                        <i className="fas fa-times"></i> Remove
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary" disabled={uploading}>
                            {uploading ? <><i className="fas fa-spinner fa-spin"></i> Uploading...</> : <><i className="fas fa-save"></i> Save</>}
                        </button>
                        <button type="button" className="btn-secondary" onClick={resetForm}>
                            <i className="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="product-table-container">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.ProductID}>
                                <td>{product.ProductID}</td>
                                <td>
                                    <img src={product.ImageURL || 'https://via.placeholder.com/60'} alt={product.Name} />
                                </td>
                                <td>{product.Name}</td>
                                <td>${product.Price}</td>
                                <td>{product.Stock}</td>
                                <td>
                                    <button onClick={() => handleEdit(product)} className="btn-edit">
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.ProductID)} className="btn-delete">
                                        <i className="fas fa-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProducts;