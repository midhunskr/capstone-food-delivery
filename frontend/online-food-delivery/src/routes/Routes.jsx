import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/user/HomePage";
import { LoginPage } from "../pages/user/LoginPage";
import { SignUpPage } from "../pages/user/SignUpPage";
import { ResraurantPage } from "../pages/user/ResraurantPage";
import { CartPage } from "../pages/user/CartPage";
import { UserLayout } from "../layouts/userLayout";

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
        },
        {
          path: '/restaurants',
          element: <ResraurantPage/>
        },
        {
          path: '/signup',
          element: <CartPage/>
        }
      ]
    },
    {
      path: 'user',
      element: <UserLayout/>,
      children: [
        {
          path: '',
          element: <HomePage/>
        }
      ]
    }
  ])