import Navbar from "../components/Navbar";
import { createBrowserRouter, redirect } from "react-router-dom";
import Auth from "../pages/auth/page";
import Profile from "../pages/profile/page";
import LandingPage from "../pages/landing/page";
import Home from "../pages/home/page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        children: [
            {
                index: true,
                loader: () => {
                    if (localStorage.getItem("token")) {
                        return redirect("/dashboard")
                    }
                    return null
                },
                element: <LandingPage />,
            },
            {
                path: "users/:username",
                element: <Profile />,
            },
        ]
    },
    {
        path: "/dashboard",
        element: <Home />
    },
    {
        path: "/auth",
        loader: () => {
            if (localStorage.getItem("token")) {
                return redirect("/dashboard")
            }
            return null
        },
        element: <Auth />,
    }
])