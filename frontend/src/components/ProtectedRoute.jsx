import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const location = useLocation();

    // 1. Check Authentication
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check Authorization (Role)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If user tries to access restricted area, redirect to their main dashboard
        return <Navigate to="/admin/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
