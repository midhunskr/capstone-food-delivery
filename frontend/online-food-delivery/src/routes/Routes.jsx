import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/user/HomePage";
import { LoginPage } from "../pages/user/LoginPage";
import { SignUpPage } from "../pages/user/SignUpPage";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout/>,
      children: [
        {
            path: '/',
            element: <HomePage/>
        },
        {
            path: '/login',
            element: <LoginPage/>
        },
        {
            path: '/signup',
            element: <SignUpPage/>
        }
      ]
    },
  ])