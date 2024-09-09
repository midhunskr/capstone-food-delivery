import PropTypes from "prop-types"
import './RestaurantAndCuisine.css'
import { useEffect, useRef, useState } from "react"
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
import { axiosInstance } from "../../../config/axioInstance";

export const RestaurantListing = ({ className = "" }) => {
  // //Setting States for fetching Restaurant data
  const [restaurants, setRestaurants] = useState([])

  //Calling backend to fetch data
  const fetchRestaurants = async () => {
    try {
      const response = await axiosInstance({
        url: '/restaurant/all-restaurants',
        method: 'GET',
        withCredentials: true
      })

      // Set restaurants from the correct path in the response
      if (Array.isArray(response?.data?.restaurants)) {
        setRestaurants(response.data.restaurants); // Correctly accessing the restaurants array
      } else {
        setRestaurants([]); // Fallback to an empty array if restaurants is not available
      }
      
    } catch (error) {
      console.log(error);
      toast.error('Error fetching restaurant data');
    }
  }
  
  useEffect(() => {
    fetchRestaurants()
  }, [])

  //Random ETA Generator
  const getRandomETA = () => {
    return Math.floor(Math.random() * (50 - 15 + 1)) + 15;
  };

  //Scroller
  const [scrollPosition, setScrollPosition] = useState(0)
  const [buttonColor, setButtonColor] = useState({ left: '#CACACA', right: '#CACACA' })

  const containerRef = useRef();

  const handleScroll = (scrollAmount) => {
    const container = containerRef.current;

    // Calculate new scroll position with boundary checks
    const newScrollPosition = Math.max(
      0,
      Math.min(
        scrollPosition + scrollAmount,
        container.scrollWidth - container.clientWidth
      )
    );

    // Update state and apply new scroll position
    setScrollPosition(newScrollPosition);
    container.scrollLeft = newScrollPosition;
  };

  //Find scroll limit for changing scroll navigation buttons color accordingly
  useEffect(() => {
    const container = containerRef.current;

    // Check if the scroll position is at the left or right limit
    const atLeftLimit = container.scrollLeft === 0;
    const atRightLimit = container.scrollLeft === container.scrollWidth - container.clientWidth;

    setButtonColor({
      left: atLeftLimit ? '#E0E0E0' : '#CACACA',
      right: atRightLimit ? '#E0E0E0' : '#CACACA',
    });
  }, [scrollPosition]);

  return (
    <>
      <div className={`self-stretch flex flex-col items-center justify-center py-[0rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
        <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
          <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
            <h3 className="m-0 w-[20.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
              Top Restaurants near by
            </h3>
            <div className="w-[3.688rem] flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
              <div className="leftAndRightNavigationButtons self-stretch h-[1.625rem] relative">
                <button onClick={() => handleScroll(-300)} className="cursor-pointer buttonLeft absolute top-[0rem] left-[0rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.left }}>
                  <img src="/arrow-left.svg" alt="" />
                </button>
                <button onClick={() => handleScroll(300)} className="cursor-pointer buttonRight absolute top-[0rem] left-[2.063rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.right }}>
                <img src="/arrow-right.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroller */}
      <div className="scrollSection2 flex flex-col items-center pb-[3rem]">
        <div
          ref={containerRef}
          className="scroll-container w-[69.5rem]"
          style={{
            // width: "900px",
            overflowX: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <div className="flex flex-row gap-[2.818rem] shrink-0 max-w-full text-[1.413rem] text-white">
          {restaurants.map((item) => {

            const backgroundImageUrl = item.menuItems[0]?.image

            return (
              <div key={item._id} className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
                <Link to={`restaurant/${item._id}`}>
                  <div
                    className="restaurantCard restaurant1 rounded-[1.5rem] relative overflow-hidden w-[15rem] h-[11rem] text-bg-white shadow-md"
                    style={{
                      border: "8px solid white",
                      backgroundImage: `url(${backgroundImageUrl})`, // map background image
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                    >
                    <b className="w-[6.3rem] top-[6rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                      {item.discountPercentage || "10% OFF"} {/* Sample default */}
                    </b>
                    <div className="w-[5.669rem] top-[7.7rem] right-[5.2rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                      {item.upToAmount || "Up to ₹50"} {/* Sample default */}
                    </div>
                  </div>
                </Link>
                <div className="flex flex-col items-start justify-start gap-[0.75rem text-dark">
                  <div className="flex flex-row items-start justify-start">
                    <b className="relative mq450:text-[1.125rem] left-[.5rem] ">
                    {item.name.length > 14 ? `${item.name.slice(0, 14)}....` : item.name} {/* Restaurant name */}
                    </b>
                  </div>
                  <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint pt-[.5rem]">
                    <img
                      className="h-[1.45rem] w-[1.519rem] left-[.5rem] relative object-cover min-h-[1.438rem]"
                      loading="lazy"
                      alt=""
                      src="/frame-3830@2x.png"
                    />
                    <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                      <b className="relative inline-block min-w-[3.581rem] left-[.7rem] font-normal">
                      {getRandomETA()} mins
                      </b>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </>
  );
};

RestaurantListing.propTypes = {
  className: PropTypes.string,
};
