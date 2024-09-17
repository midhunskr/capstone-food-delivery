import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "../layouts/RootLayout";
import { HomePage } from "../pages/user/HomePage";
import { PizzaHut } from "../pages/user/restaurants/PizzaHut";
import { CheckoutPage } from "../pages/user/CheckoutPage";
import { UserLayout } from "../layouts/userLayout";
import { PublicLandingPage } from "../pages/publicUsers/PublicLandingPage";
import { AllRestaurants } from "../pages/user/restaurants/AllRestaurants";
import { RestaurantPage } from "../pages/user/restaurants/RestaurantPage";
import { UserAuth } from "./protectedRoutes/UserAuth";
import { HelpPage } from "../pages/publicUsers/HelpPage";
import { ProfilePage } from "../pages/user/ProfilePage";
import { ReduxTest } from "../components/user/restaurant/restaurantMain/reduxTest";

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
          path: 'help',
          element: <HelpPage/>
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
          path: 'restaurant/:id',
          element: <RestaurantPage/>
        },
        {
          path: "pizzahut",
          element: <PizzaHut/>
        },
        {
          path: "profile",
          element: <ProfilePage/>
        },
        {
          path: "checkout",
          element: <CheckoutPage/>
        },
        {
          path: "checkout/success",
          element: <h1>Payment Success</h1>
        },
        {
          path: "checkout/cancel",
          element: <h1>Payment Cancelled</h1>
        },
        {
          path: "test",
          element: <ReduxTest/>
        }
      ]
    }
  ])