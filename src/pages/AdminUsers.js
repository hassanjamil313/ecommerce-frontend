import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext'; // <-- import useAuth
import './AdminUsers.css';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const { user: currentUser } = useAuth(); // logged‑in admin

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await API.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, currentRole) => {
        const newRole = currentRole === 'Admin' ? 'Customer' : 'Admin';
        if (!window.confirm(`Change role to ${newRole}?`)) return;

        setUpdating(true);
        try {
            await API.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(user =>
                user.UserID === userId ? { ...user, Role: newRole } : user
            ));
        } catch (error) {
            console.error('Error updating role:', error);
            alert(error.response?.data?.message || 'Failed to update role');
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/admin/users/${userId}`);
            setUsers(users.filter(user => user.UserID !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <div>Loading users...</div>;

    return (
        <div className="admin-users">
            <h2>Manage Users</h2>
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.UserID}>
                                <td>{user.UserID}</td>
                                <td>{user.Email}</td>
                                <td>{user.FirstName} {user.LastName}</td>
                                <td>
                                    <span className={`role-badge role-${user.Role.toLowerCase()}`}>
                                        {user.Role}
                                    </span>
                                </td>
                                <td>{user.IsActive ? 'Yes' : 'No'}</td>
                                <td>
                                    {/* Disable buttons for current admin */}
                                    {currentUser?.id === user.UserID ? (
                                        <span className="self-action-disabled">(you)</span>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleRoleChange(user.UserID, user.Role)}
                                                className="btn-role"
                                                disabled={updating}
                                            >
                                                {user.Role === 'Admin' ? 'Demote to Customer' : 'Promote to Admin'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.UserID)}
                                                className="btn-delete"
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;