import {createBrowserRouter, Navigate} from "react-router"
import Login from "./Features/auth/pages/Login"
import Register from "./Features/auth/pages/Register"
import Protected from "./Features/auth/components/Protected"
import Home from "./Features/home/pages/Home"

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Protected><Home/></Protected>
    },
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
])