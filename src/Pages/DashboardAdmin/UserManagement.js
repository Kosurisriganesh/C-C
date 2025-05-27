import React, { useState, useEffect } from 'react';
import { db } from '../../Pages/Firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TextField, Button, CircularProgress
} from '@mui/material';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const usersCollection = collection(db, 'users');
            const userSnapshot = await getDocs(usersCollection);
            const usersList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                isActive: doc.data().isActive !== false // Default to true if not specified
            }));
            setUsers(usersList);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users: ", error);
            setLoading(false);
        }
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        try {
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isActive: !currentStatus
            });

            // Update local state
            setUsers(users.map(user =>
                user.id === userId ? { ...user, isActive: !currentStatus } : user
            ));
        } catch (error) {
            console.error("Error updating user status: ", error);
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    });

    const filteredUsers = sortedUsers.filter(user => {
        return (
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <h2>User Management</h2>
                <div className="user-management-actions">
                    <div className="search-container">
                        <TextField
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                            variant="outlined"
                            size="small"
                        />
                    </div>
                    <Button variant="contained" onClick={fetchUsers}>
                        Refresh
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="loading-spinner"><CircularProgress /></div>
            ) : (
                <TableContainer component={Paper} className="users-table-container">
                    <Table className="users-table">
                        <TableHead>
                            <TableRow>
                                <TableCell onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                    Name {sortConfig.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </TableCell>
                                <TableCell onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
                                    Email {sortConfig.key === 'email' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </TableCell>
                                <TableCell onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                                    Role {sortConfig.key === 'role' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </TableCell>
                                <TableCell onClick={() => handleSort('registrationDate')} style={{ cursor: 'pointer' }}>
                                    Registration Date {sortConfig.key === 'registrationDate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </TableCell>
                                <TableCell onClick={() => handleSort('isActive')} style={{ cursor: 'pointer' }}>
                                    Status {sortConfig.key === 'isActive' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                                </TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="user-info">
                                                <img
                                                    src={user.photoURL || process.env.PUBLIC_URL + '/profilepic.jpg'}
                                                    alt={user.name}
                                                    className="user-avatar"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = process.env.PUBLIC_URL + '/profilepic.jpg';
                                                    }}
                                                />
                                                <span>{user.name || 'N/A'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{user.email || 'N/A'}</TableCell>
                                        <TableCell>{user.role || 'User'}</TableCell>
                                        <TableCell>
                                            {user.registrationDate
                                                ? new Date(user.registrationDate.toDate()).toLocaleDateString()
                                                : 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color={user.isActive ? 'error' : 'success'}
                                                onClick={() => toggleUserStatus(user.id, user.isActive)}
                                            >
                                                {user.isActive ? 'Deactivate' : 'Activate'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="no-users-message">
                                        {searchTerm
                                            ? 'No users match your search criteria.'
                                            : 'No users found.'}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
};

export default UserManagement;