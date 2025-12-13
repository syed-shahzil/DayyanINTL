import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'customer' | 'management' | 'owner';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!auth?.user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && auth.profile?.role !== requiredRole && auth.profile?.role !== 'owner') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
