import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { LoginPage } from "../pages/user/LoginPage";
import { SignUpPage } from "../pages/user/SignUpPage";
import { AllRestaurants } from "../pages/user/AllRestaurants";
import { UserLayout } from "../layouts/userLayout";
import { PublicLandingPage } from "../pages/publicUsers/PublicLandingPage";
import { HomePage } from "../pages/user/HomePage";
import { SingleRestaurant } from "../pages/user/SingleRestaurant";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout/>,
      children: [
        {
          path: '',
          element: <PublicLandingPage/>
        },
        {
          path: 'login',
          element: <LoginPage/>
        },
        {
          path: 'signup',
          element: <SignUpPage/>
        },
      ]
    },
    {
      path: 'user',
      element: <UserLayout/>,
      children: [
        {
          path: '',
          element: <HomePage/>
        },
        {
          path: 'restaurants',
          element: <AllRestaurants/>
        },
        {
          path: 'restaurants/:id',
          element: <SingleRestaurant/>
        },
        {
          path: 'myorders',
          element: <SingleRestaurant/>
        }
      ]

    }
  ])