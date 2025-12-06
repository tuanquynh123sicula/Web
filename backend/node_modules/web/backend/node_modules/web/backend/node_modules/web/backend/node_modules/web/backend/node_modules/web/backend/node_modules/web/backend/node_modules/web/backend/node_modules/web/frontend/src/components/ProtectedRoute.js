import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Store } from '../Store';
export default function ProtectedRoute() {
    const { state: { userInfo }, } = useContext(Store);
    if (userInfo) {
        return _jsx(Outlet, {});
    }
    else {
        return _jsx(Navigate, { to: "/signin" });
    }
}
