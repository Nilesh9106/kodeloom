import Navbar from "../components/Navbar";
import { createBrowserRouter, redirect } from "react-router-dom";
import Auth from "../pages/auth/page";
import Profile from "../pages/profile/page";
import LandingPage from "../pages/landing/page";
import Home from "../pages/dashboard/page";
import useLoom from "./context";
import { User } from "./interfaces";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navbar />,
        loader: () => {
            if (localStorage.getItem("user")) {
                useLoom.setState({ user: JSON.parse(localStorage.getItem("user")!) as User })
            }
            return null
        },
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
        loader: () => {
            if (!localStorage.getItem("token")) {
                return redirect("/auth")
            }
            useLoom.setState({ user: JSON.parse(localStorage.getItem("user")!) as User })
            return null
        },
        element: <Home />,
        children: [
            {
                path: "p/create",
                element: <div>create project</div>
            },
            {
                path: "p/:id",
                element: <div>project</div>
            },
        ]
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