import Navbar from "../components/Navbar";
import { createBrowserRouter, redirect } from "react-router-dom";
import Auth from "../pages/auth/page";
import Profile from "../pages/profile/page";
import LandingPage from "../pages/landing/page";
import Home from "../pages/dashboard/page";
import useLoom from "./context";
import CreateProject from "../pages/dashboard/project/Create";
import ProjectPage from "../pages/dashboard/project/ProjectPage";
import ProjectInfo from "../pages/dashboard/project/projectInfo";
import { User } from "../types/auth";
import { InvitePage } from "../pages/dashboard/invites/page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navbar />,
    loader: () => {
      if (localStorage.getItem("user")) {
        useLoom.setState({
          user: JSON.parse(localStorage.getItem("user")!) as User,
        });
      }
      return null;
    },
    children: [
      {
        index: true,
        loader: () => {
          if (localStorage.getItem("token")) {
            return redirect("/dashboard");
          }
          return null;
        },
        element: <LandingPage />,
      },
      {
        path: "users/:username",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/dashboard",
    loader: () => {
      if (!localStorage.getItem("token")) {
        return redirect("/auth");
      }
      useLoom.setState({
        user: JSON.parse(localStorage.getItem("user")!) as User,
      });
      return null;
    },
    element: <Home />,
    children: [
      {
        index: true,
        loader: () => {
          if (useLoom.getState().projects.length > 0) {
            return redirect(
              `/dashboard/p/${useLoom.getState().projects[0]._id}`
            );
          } else {
            return redirect("/dashboard/p/create");
          }
        },
      },
      {
        path: "p/create",
        element: <CreateProject />,
      },
      {
        path: "p/:id/info",
        element: <ProjectInfo />,
      },
      {
        path: "p/:id",
        element: <ProjectPage />,
      },
      {
        path: "invites",
        element: <InvitePage />,
      },
    ],
  },
  {
    path: "/auth",
    loader: () => {
      if (localStorage.getItem("token")) {
        return redirect("/dashboard");
      }
      return null;
    },
    element: <Auth />,
  },
]);
