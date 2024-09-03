import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/user/HomePage";
import { PizzaHut } from "../pages/user/restaurants/PizzaHut";
import { CartPage } from "../pages/user/CartPage";
import { UserLayout } from "../layouts/userLayout";
import { PublicLandingPage } from "../pages/publicUsers/PublicLandingPage";
import { AllRestaurants } from "../pages/user/restaurants/AllRestaurants";
import { RestaurantPage } from "../pages/publicUsers/RestaurantPage";
import { UserAuth } from "./protectedRoutes/UserAuth";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout/>,
      children: [
        {
            path: '/',
            element: <PublicLandingPage/>
        },
        {
          path: '/restaurants',
          element: <RestaurantPage/>
        },
        {
          path: '/signup',
          element: <CartPage/>
        }
      ]
    },
    {
      path: "user",
      element: (
        <UserAuth>
          <UserLayout />
        </UserAuth>
      ),
      children: [
        {
          path: "",
          element: <HomePage/>
        },
        {
          path: "restaurants",
          element: <AllRestaurants/>
        },
        {
          path: "pizzahut",
          element: <PizzaHut/>
        }
      ]
    }
  ])