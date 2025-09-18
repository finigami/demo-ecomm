import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminUsers.css';

const AdminUsers: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminAPI.getUsers(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) => 
      adminAPI.updateUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });

  const handleRoleChange = (userId: number, newRole: string) => {
    setSelectedRole(prev => ({ ...prev, [userId]: newRole }));
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="admin-users">
        <div className="container">
          <h1>User Management</h1>
          <div className="error-message">
            Failed to load users. Please check your admin privileges.
          </div>
        </div>
      </div>
    );
  }

  const users = usersData?.data.users || [];

  return (
    <div className="admin-users">
      <div className="container">
        <div className="page-header">
          <h1>User Management</h1>
          <a href="/admin" className="back-link">← Back to Dashboard</a>
        </div>

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <select
                      value={selectedRole[user.id] || user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="role-select"
                      disabled={updateRoleMutation.isPending}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="no-data">
            <p>No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
