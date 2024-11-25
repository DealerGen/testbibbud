import React from 'react';
import AdminPage from './AdminPage';

const AdminVehiclesPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-white">Profit Calculator</h1>
      <AdminPage />
    </div>
  );
};

export default AdminVehiclesPage;