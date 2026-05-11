import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

export default function AdminRoute({children}) {

    const {user , isAuthenticated} = useSelector((state)=>state.auth);

    if(!isAuthenticated){
        return <Navigate to="/" />;
    }

    if(user?.role !== "admin"){
        return <Navigate to="/" />;
    }

  return children;
}
