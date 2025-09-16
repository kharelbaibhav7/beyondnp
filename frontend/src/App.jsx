import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './component/components/Navbar';
import MyRoutes from './component/components/MyRoutes';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <MyRoutes />
        </main>
      </div>
    </AuthProvider>
  );
};

export default App;