import Navbar from "../components/Navbar";
import { createBrowserRouter } from "react-router-dom";
import Auth from "../pages/auth/page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        children: [
            {
                index: true,
                element: <h1>Home</h1>,
            },
        ]
    },
    {
        path: "/auth",
        element: <Auth />,
    }
])