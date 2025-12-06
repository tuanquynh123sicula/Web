import { jsx as _jsx } from "react/jsx-runtime";
// src/admin/components/AdminProtectedRoute.tsx
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../../Store'; // adjust path if necessary
export default function AdminProtectedRoute() {
    const { state } = useContext(Store);
    const { userInfo } = state;
    if (!userInfo) {
        return _jsx(Navigate, { to: "/signin", replace: true });
    }
    if (!userInfo.isAdmin) {
        return _jsx(Navigate, { to: "/403", replace: true });
    }
    return _jsx(Outlet, {});
}
