import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../../../config/axioInstance";

export const RestaurantHeader = ({ className = "" }) => {
    const { id } = useParams() // Extract restaurant ID from URL
    const [restaurant, setRestaurant] = useState([]) //Setting State for Restaurant Fetcher

    const fetchRestaurant = async () => {
        try {
          const response = await axiosInstance({
            url: `/restaurant/${id}`,  // Ensure this URL is correct
            method: 'GET',
            withCredentials: true
          });
      
          // Check if the response contains the expected data
          if (response?.data?.restaurant) {
            setRestaurant(response.data.restaurant);
          } else {
            console.log("No restaurant data found"); // Log if restaurant data is missing
            setRestaurant(null); // Fallback if restaurant not found
          }
        } catch (error) {
          console.error("Error fetching restaurant data:", error); // Log any errors
          toast.error('Error fetching restaurant data');
        }
      };


    useEffect(() => {
        if (id) {
            fetchRestaurant(); // Fetch restaurant when component mounts
        }
    }, [id]);

    console.log(restaurant);

    return (
        <div >
            {restaurant ? (
                <h3>{restaurant.name}</h3> // Display the restaurant name
            ) : (
                <p>Loading restaurant data...</p> // Loading or error message
            )}
        </div>
    )
}