import React from 'react';
import {useLocation, Navigate} from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode; // 你可以根据实际需要调整这里的类型
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const loginToken:string|null = sessionStorage.getItem('loginToken');
  const isAuthenticated = !!(loginToken && loginToken != '');

  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/Login" state={{ from: location }} replace />
  }

  return element;
};

export default PrivateRoute;