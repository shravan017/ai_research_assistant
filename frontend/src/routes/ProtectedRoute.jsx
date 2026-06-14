
import React from 'react'
import {Navigate, useLocation} from "react-router-dom"
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation()
    if (!isAuthenticated) {
        if(location.pathname === "/dashboard" || location.pathname.startsWith("/workspace")){
            return <Navigate to="/" replace />
        }
        return <Navigate to="/login" replace />;
    }
    return children
}

export default ProtectedRoute