 import { Navigate } from "react-router-dom";
import useAuthStore from "../../store/AuthStore";
 import React from 'react'
 
 const PrivateRoute = ({children}) => {
     const token = useAuthStore((state) => state.token)

     return token ? children : <Navigate to = "/login" replace/>
 }
 
 export default PrivateRoute