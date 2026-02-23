import React, { useState, useEffect } from 'react';
import API from '../services/api';
import './AdminCategories.css';

const AdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await API.put(`/categories/${editingCategory.CategoryID}`, formData);
            } else {
                await API.post('/categories', formData);
            }
            fetchCategories();
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
            alert(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ Name: category.Name, Description: category.Description || '' });
        setShowForm(true);
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm('Are you sure you want to delete this category?')) return;
        try {
            await API.delete(`/categories/${categoryId}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
            alert(error.response?.data?.message || 'Failed to delete category');
        }
    };

    const resetForm = () => {
        setEditingCategory(null);
        setFormData({ Name: '', Description: '' });
        setShowForm(false);
    };

    if (loading) return <div className="loading">Loading categories...</div>;

    return (
        <div className="admin-categories">
            <div className="admin-header">
                <h2>Manage Categories</h2>
                <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Category'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="category-form">
                    <h3>{editingCategory ? 'Edit Category' : 'New Category'}</h3>
                    <div className="form-grid">
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
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="btn-primary">Save</button>
                        <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
                    </div>
                </form>
            )}

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.CategoryID}>
                                <td>{category.CategoryID}</td>
                                <td>{category.Name}</td>
                                <td>{category.Description}</td>
                                <td>
                                    <button onClick={() => handleEdit(category)} className="btn-edit">
                                        <i className="fas fa-edit"></i> Edit
                                    </button>
                                    <button onClick={() => handleDelete(category.CategoryID)} className="btn-delete">
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

export default AdminCategories;