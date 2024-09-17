import PropTypes from "prop-types"
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchRestaurantData } from "../../../../redux/features/restaurantSlice";
import toast from "react-hot-toast";
import { axiosInstance } from "../../../../config/axioInstance";

export const ReduxTest = () => {
    // const [restaurant, setRestaurant] = useState({}) //Setting State for Restaurant Fetcher
    const dispatch = useDispatch()
    const restaurant = useSelector((state) => state.restaurantData?.restaurant)

    const fetchRestaurant = async () => {
        try {
          const response = await axiosInstance({
            url: `/restaurant/66dafb6de6471fb01207b207`,  // Ensure this URL is correct
            method: 'GET',
            withCredentials: true
          });
          dispatch(fetchRestaurantData(response.data.restaurant))
          // Check if the response contains the expected data
        //   if (response?.data?.restaurant) {
        //     setRestaurant(response.data.restaurant);
        //   } else {
        //     console.log("No restaurant data found"); // Log if restaurant data is missing
        //     setRestaurant(null); // Fallback if restaurant not found
        //   }
        } catch (error) {
          console.error("Error fetching restaurant data:", error); // Log any errors
          toast.error('Error fetching restaurant data');
        }
      };
      
      useEffect(() => {
        fetchRestaurant()
      }, [dispatch])
    
    console.log('restaurant======', restaurant);
    
    return (
        <div>

        </div>
    )
}

ReduxTest.propTypes = {
    className: PropTypes.string,
}