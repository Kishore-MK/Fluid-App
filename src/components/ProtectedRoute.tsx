import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isInitialized } = useWallet();

  if (!isInitialized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}