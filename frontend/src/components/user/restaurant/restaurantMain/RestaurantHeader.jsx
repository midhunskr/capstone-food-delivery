// import PropTypes from "prop-types"
// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { axiosInstance } from "../../../../config/axioInstance";
// import { useSelector, useDispatch } from 'react-redux'
// import { addItemToCart, removeItemFromCart, decrement, increment } from "../../../../redux/features/cartSlice";

// export const RestaurantHeader = ({ className = "" }) => {

//   //Data
//   const SAMPLE_DATA = [
//     { image: "/biriyani-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹70", itemName: "Biriyani" },
//     { image: "/noodles-1@2x.png", discountPercentage: "15% OFF", upToAmount: "Up to ₹90", itemName: "Noodles" },
//     { image: "/burgers-1@2x.png", discountPercentage: "35% OFF", upToAmount: "Up to ₹120", itemName: "Burgers" },
//     { image: "/pizza-5@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Pizzas" },
//     { image: "/rolls-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Rolls" }
//   ];

//   const [scrollPosition, setScrollPosition] = useState(0)
//   const [buttonColor, setButtonColor] = useState({ left: '#CACACA', right: '#CACACA' })
//   const containerRef = useRef();
//   const { id } = useParams() // Extract restaurant ID from URL
//   const [restaurant, setRestaurant] = useState({}) //Setting State for Restaurant Fetcher
//   const [quantityItems, setQuantityItems] = useState({});
//   const itemsQuantity = useSelector((state) => state.cart.items) //Counter Redux


//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   //Scroller
//   const handleScroll = (scrollAmount) => {
//     const container = containerRef.current;

//     // Calculate new scroll position with boundary checks
//     const newScrollPosition = Math.max(
//       0,
//       Math.min(
//         scrollPosition + scrollAmount,
//         container.scrollWidth - container.clientWidth
//       )
//     );

//     // Update state and apply new scroll position
//     setScrollPosition(newScrollPosition);
//     container.scrollLeft = newScrollPosition;
//   };

//   //Scroll button
//   useEffect(() => {
//     if (containerRef.current) {  // Check if containerRef is not null
//       const container = containerRef.current;
//       const atLeftLimit = container.scrollLeft === 0;
//       const atRightLimit = container.scrollLeft === container.scrollWidth - container.clientWidth;
//       setButtonColor({
//         left: atLeftLimit ? '#E0E0E0' : '#CACACA',
//         right: atRightLimit ? '#E0E0E0' : '#CACACA',
//       });
//     }
//   }, [scrollPosition]);

//   //Fetch backend data
//   const fetchRestaurant = async () => {
//     try {
//       const response = await axiosInstance({
//         url: `/restaurant/${id}`,  // Ensure this URL is correct
//         method: 'GET',
//         withCredentials: true
//       });
//       // Check if the response contains the expected data
//       if (response?.data?.restaurant) {
//         setRestaurant(response.data.restaurant);
//       } else {
//         console.log("No restaurant data found"); // Log if restaurant data is missing
//         setRestaurant(null); // Fallback if restaurant not found
//       }
//     } catch (error) {
//       console.error("Error fetching restaurant data:", error); // Log any errors
//       toast.error('Error fetching restaurant data');
//     }
//   };

//   useEffect(() => {
//     if (id) {
//       fetchRestaurant(); // Fetch restaurant when component mounts
//     }
//   }, [id]);

//   console.log(restaurant.menuItems);

//   // Function to handle button click and show quantity selector
//   const handleButtonClick = (item) => {

//     // Ensure the item has _id or handle it if not present
//     if (!item || !item._id) {
//       console.error("Item does not have an _id:", item);
//       return;
//     }

//     setQuantityItems((prevState) => ({
//       ...prevState,
//       [item._id]: { ...item, quantity: 0 },
//     }));

//     const payload = { item, quantity: 0 };

//     dispatch(addItemToCart(payload));
//     console.log("Dispatched payload:", payload);
//   };



//   return (
//     <div>
//       <div className={`self-stretch flex flex-col items-center bg-bg-white text-dark justify-center py-[2rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
//         <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
//           <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
//             {restaurant ? (
//               <h3 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
//                 {restaurant.name}
//               </h3>
//             ) : (
//               <p>Loading restaurant data...</p>
//             )}
//           </div>
//           <div className="shrink w-full py-[1.2rem] flex items-center  px-[1.2rem] rounded-3xl" style={{ background: "linear-gradient(180deg, rgba(167,208,139,1) 0%, rgba(104,177,159,1) 100%)" }}>
//             <div className="bg-bg-white shrink px-[1rem] py-[1rem] w-full flex-row rounded-2xl shadow-lg">
//               <div className="flex items-center ">
//                 <div className="w-[1.7rem] h-[1.7rem] rounded-full bg-tradewind flex justify-center">
//                   <img className="w-[1.2rem]" src="/star.svg" alt="" />
//                 </div>
//                 <div>
//                   <b className="text-sm px-[.5rem]">4.2 <b className="text-label-tint font-normal">(60 ratings)</b></b>
//                 </div>
//               </div>
//               <div className="text-sm text-jaffa py-[1rem]">
//                 <b>{restaurant.description}</b>
//               </div>
//               <div className="flex items-center">
//                 <div>
//                   <img className="w-[.5rem] pt-[.5rem]" src="/connecting-line.svg" alt="" />
//                 </div>
//                 <div className="flex flex-col gap-[2.5rem]">
//                   <div className="flex items-center">
//                     <b className="text-sm text-dark px-[1rem]">Outlet</b>
//                     <b className="text-sm text-label-tint font-normal">{restaurant.location}</b>
//                   </div>
//                   <b className="flex flex-row text-sm text-dark px-[1rem]">25-30 mins</b>
//                 </div>
//               </div>
//               <div className="py-[1rem] flex items-center">
//                 <img className="w-5 text-label-tint" src="/delivery.svg" alt="" />
//                 <b className="text-sm text-label-tint font-light px-[1rem]">Order above 149 eligible for free delivery</b>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className={`self-stretch flex flex-col items-center justify-center py-[1rem] px-[0rem] pb-[0rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
//               <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
//                 <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
//                   <h3 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
//                     Deals for you
//                   </h3>
//                   <div className="w-[3.688rem] flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
//                     <div className="leftAndRightNavigationButtons self-stretch h-[1.625rem] relative">
//                       <button onClick={() => handleScroll(-300)} className="cursor-pointer buttonLeft absolute top-[0rem] left-[0rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.left }}>
//                         <img src="/arrow-left.svg" alt="" />
//                       </button>
//                       <button onClick={() => handleScroll(300)} className="cursor-pointer buttonRight absolute top-[0rem] left-[2.063rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.right }}>
//                         <img src="/arrow-right.svg" alt="" />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="scrollSection2 flex flex-col items-center py-[2rem]">
//               <div
//                 ref={containerRef}
//                 className="scroll-container w-[69.5rem]"
//                 style={{
//                   overflowX: "scroll",
//                   scrollBehavior: "smooth",
//                 }}
//               >
//                 <div className="flex flex-row justify-start gap-[10rem] max-w-full text-[1.413rem] text-white">
//                   {SAMPLE_DATA.map((item, idx) => (
//                     <div key={`${item.itemName}-${idx}`} className="w-[10rem] flex flex-col">
//                       <div className="w-[18rem] rounded-2xl h-[7rem] border-[.2rem] border-solid border-selection-tint" />
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Menu Section */}
//         <div className="flex items-center justify-center gap-4">
//           <div className="w-[31rem] h-[.1rem] bg-selection-tint" />
//           <div>
//             <b>M E N U</b>
//           </div>
//           <div className="w-[31rem] h-[.1rem] bg-selection-tint" />
//         </div>

//         <div className={`w-[70.5rem] flex flex-col py-[1rem] px-[0rem] pb-[0rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
//           <div className="h-full pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full">
//             <h3 className="text-inherit text-dark font-bold font-[inherit] shrink-0 max-w-full px-[.5rem]">
//               Top Picks
//             </h3>
//           </div>

//           <div className="flex justify-between py-[2rem]">
//             {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
//               // Shuffle the menu items array and then slice to get up to 3 items
//               [...restaurant.menuItems]
//                 .sort(() => Math.random() - 0.5) // Shuffle array
//                 .slice(0, 3) // Take up to 3 items
//                 .map((item) => (
//                   <div key={item._id} className="flex-col topPicksCard w-[20rem] h-[11rem] flex relative overflow-hidden rounded-3xl border-[.2rem] border-solid text-bg-white shadow-md" style={{
//                     border: "8px solid white", backgroundImage: `url(${item.image})`, backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                   }}>
//                     <b className="top-[5.8rem] left-[1rem] relative inline-block z-[2] text-2xl">{item.name.length < 16 ? item.name : (item.name.slice(0, 15) + '....')}</b>
//                     <div className="top-[6rem] left-[1rem] text-mid relative z-[2]">
//                       {"₹" + item.price || "Up to ₹50"} {/* Sample default */}
//                     </div>
//                   </div>
//                 ))
//             ) : (
//               <p>No menu items available</p> // Fallback in case of no menu items
//             )}
//           </div>

//           <div className="divide-y-[.1rem] divide-solid divide-selection-tint">
//             {[
//               {
//                 title: "Recommended",
//                 filter: item => item.recommended,
//                 img: item => (item.veg ? "/veg.svg" : "/non-veg.svg"),
//                 alt: item => (item.veg ? "Veg" : "Non-Veg"),
//               },
//               {
//                 title: "Veg",
//                 filter: item => item.veg,
//                 img: () => "/veg.svg",
//                 alt: () => "Veg",
//               },
//               {
//                 title: "Non-Veg",
//                 filter: item => !item.veg,
//                 img: () => "/non-veg.svg",
//                 alt: () => "Non-Veg",
//               },
//               ...[...new Set(restaurant.menuItems ? restaurant.menuItems.map(item => item.category) : "")]
//                 .filter(Boolean)
//                 .map(category => ({
//                   title: category,
//                   filter: item => item.category === category,
//                   img: item => (item.veg ? "/veg.svg" : "/non-veg.svg"),
//                   alt: item => (item.veg ? "Veg" : "Non-Veg"),
//                 })),
//             ].map((section, index) => {
//               const filteredItems = restaurant.menuItems ? restaurant.menuItems.filter(section.filter) : "";
//               return filteredItems.length > 0 && (
//                 <div key={index} className="collapse bg-bg-white rounded-none">
//                   <input type="radio" name="my-accordion-1" defaultChecked={index === 0} />
//                   <div className="collapse-title text-xl font-bold text-dark">
//                     <b className="sectionAndCount">
//                       {section.title} ({filteredItems.length})
//                     </b>
//                   </div>
//                   <div className="collapse-content text-dark">
//                     {filteredItems.map(item => (
//                       <div key={item._id} className="flex items-center justify-between py-[2rem]">
//                         {/* Left Content Section */}
//                         <div className="flex flex-col items-start gap-2 w-2/3">
//                           <div className="flex gap-2 font-bold">
//                             <img className="w-5" src={section.img(item)} alt={section.alt(item)} />
//                             {item.name}
//                           </div>
//                           <div className="text-lg flex items-center gap-3 py-2">
//                             ₹{item.price}
//                             <div className="text-label-tint font-bold flex gap-1">
//                               <img className="w-5" src="/offer-tag.svg" alt="" />
//                               <b>50% OFF USE FIRSTBITE</b>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <svg className="w-5 h-5 fill-tradewind" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                               <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
//                             </svg>
//                             <b className="text-lg font-medium">4.2 (12)</b>
//                           </div>
//                           <div className="text-mid text-label-tint w-full py-5">
//                             {item.description}
//                           </div>
//                         </div>

//                         {/* Right Background Image Section with Button */}
//                         <div className="flex flex-col items-center justify-end relative w-[14rem] h-[14rem] rounded-3xl overflow-visible  shadow-lg z-1"
//                           style={{
//                             border: "10px solid white",
//                             backgroundImage: `url(${item.image})`,
//                             backgroundSize: 'cover',
//                             backgroundPosition: 'left center',
//                             backgroundRepeat: "no-repeat"
//                           }}>
//                           {/* Button or Quantity Section */}
//                           {!itemsQuantity.find((i) => i._id === item._id) ? (
//                             <button
//                               onClick={() => handleButtonClick(item)}
//                               className="addToCartButton absolute top-[11.5rem] w-[9rem] h-[3rem] text-mid font-bold bg-bg-white text-tradewind border-[.3rem] border-solid border-white px-3 py-1 rounded-xl shadow-lg z-2 cursor-pointer"
//                             >
//                               <b>Add to Cart</b>
//                             </button>
//                           ) : (
//                             <div className="absolute top-[11.5rem] w-[9rem] h-[3rem] flex items-center px-[1rem] justify-between text-tradewind text-mid font-bold gap-2 bg-bg-white border-[.3rem] border-solid border-white rounded-xl shadow-lg cursor-pointer">
//                               <button
//                                 onClick={() => {
//                                   const updatedItems = itemsQuantity.map((i) => {
//                                     if (i._id === item._id) {
//                                       if (i.quantity <= 0) {
//                                         dispatch(removeItemFromCart(i._id)); // Remove item from Redux state
//                                         return null; // Remove item from local state
//                                       } else {
//                                         dispatch(decrement(i._id)); // Decrement item in Redux state
//                                         return { ...i, quantity: i.quantity - 1 }; // Update local state
//                                       }
//                                     }
//                                     return i;
//                                   }).filter((i) => i !== null);

//                                   setQuantityItems(updatedItems); // Update local state
//                                 }}
//                                 className="decrementButton bg-white px-2 py-1 rounded-md border-[.1rem] border-solid border-disabled-tint text-tradewind cursor-pointer"
//                               >
//                                 -
//                               </button>
//                               <span className="font-bold">
//                                 {itemsQuantity.find((i) => i._id === item._id)?.quantity || 0}
//                               </span>
//                               <button
//                                 onClick={() => {
//                                   const updatedItems = itemsQuantity.map((i) => {
//                                     if (i._id === item._id) {
//                                       handleButtonClick(item); // Ensure this function is called
//                                       dispatch(increment(i._id)); // Increment item in Redux state
//                                       return { ...i, quantity: i.quantity + 1 }; // Update local state
//                                     }
//                                     return i;
//                                   });

//                                   setQuantityItems(updatedItems); // Update local state
//                                 }}
//                                 className="incrementButton bg-white px-2 py-1 rounded-md border-[.1rem] border-solid border-disabled-tint text-tradewind cursor-pointer"
//                               >
//                                 +
//                               </button>
//                             </div>
//                           )}

//                           {/* Sticky 'View Cart' Button */}
//                           {itemsQuantity.length > 0 && (
//                             <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
//                               <button
//                                 onClick={() => {
//                                   // Ensure all items have valid properties
//                                   const validItems = itemsQuantity.every(
//                                     (item) => item._id && item.name && item.price
//                                   );
//                                   if (validItems) {
//                                     navigate('/user/checkout');
//                                   } else {
//                                     console.error('Cart contains invalid items');
//                                   }
//                                 }}
//                                 className="bg-tradewind text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer cartButton"
//                               >
//                                 View Cart ({itemsQuantity.reduce((a, b) => a + (b.quantity || 0), 0)})
//                                 {console.log('Items in cart:', itemsQuantity)}
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div >
//   )
// }

// RestaurantHeader.propTypes = {
//   className: PropTypes.string,
// }









import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../../../config/axioInstance";
import { useSelector, useDispatch } from 'react-redux'
import { removeItemFromCart, decrement, increment, addToCart } from "../../../../redux/features/cartSlice";

export const RestaurantHeader = ({ className = "" }) => {

  //Data
  const SAMPLE_DATA = [
    { image: "/biriyani-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹70", itemName: "Biriyani" },
    { image: "/noodles-1@2x.png", discountPercentage: "15% OFF", upToAmount: "Up to ₹90", itemName: "Noodles" },
    { image: "/burgers-1@2x.png", discountPercentage: "35% OFF", upToAmount: "Up to ₹120", itemName: "Burgers" },
    { image: "/pizza-5@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Pizzas" },
    { image: "/rolls-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Rolls" }
  ];

  const [scrollPosition, setScrollPosition] = useState(0)
  const [buttonColor, setButtonColor] = useState({ left: '#CACACA', right: '#CACACA' })
  const containerRef = useRef();
  const { id } = useParams() // Extract restaurant ID from URL
  const [restaurant, setRestaurant] = useState({}) //Setting State for Restaurant Fetcher
  const [quantityItems, setQuantityItems] = useState({});
  const cartItems = useSelector((state) => state.cart.cartItems) //Counter Redux


  const dispatch = useDispatch()
  const navigate = useNavigate()

  //Scroller
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

  //Scroll button
  useEffect(() => {
    if (containerRef.current) {  // Check if containerRef is not null
      const container = containerRef.current;
      const atLeftLimit = container.scrollLeft === 0;
      const atRightLimit = container.scrollLeft === container.scrollWidth - container.clientWidth;
      setButtonColor({
        left: atLeftLimit ? '#E0E0E0' : '#CACACA',
        right: atRightLimit ? '#E0E0E0' : '#CACACA',
      });
    }
  }, [scrollPosition]);

  //Fetch backend data
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

  // console.log(restaurant.menuItems);

  // Function to handle button click and show quantity selector
  const handleAddToCart = (item) => {

    setQuantityItems((prevState) => ({
      ...prevState,
      [item._id]: { ...item, quantity: 1 },
    }));

    dispatch(addToCart(item))

  };

  //Handle duplicate item names
  const groupedItems = cartItems.reduce((acc, item) => {
    const existingItem = acc.find(i => i.name === item.name);

    if (existingItem) {
        // If an item with the same name exists, increment its quantity
        existingItem.quantity += 1;
    } else {
        // Otherwise, add the item to the accumulator with a quantity of 1
        acc.push({ ...item, quantity: 1 });
    }

    return acc;
}, []);


  return (
    <div>
      <div className={`self-stretch flex flex-col items-center bg-bg-white text-dark justify-center py-[2rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
        <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
          <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
            {restaurant ? (
              <h3 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
                {restaurant.name}
              </h3>
            ) : (
              <p>Loading restaurant data...</p>
            )}
          </div>
          <div className="shrink w-full py-[1.2rem] flex items-center  px-[1.2rem] rounded-3xl" style={{ background: "linear-gradient(180deg, rgba(167,208,139,1) 0%, rgba(104,177,159,1) 100%)" }}>
            <div className="bg-bg-white shrink px-[1rem] py-[1rem] w-full flex-row rounded-2xl shadow-lg">
              <div className="flex items-center ">
                <div className="w-[1.7rem] h-[1.7rem] rounded-full bg-tradewind flex justify-center">
                  <img className="w-[1.2rem]" src="/star.svg" alt="" />
                </div>
                <div>
                  <b className="text-sm px-[.5rem]">4.2 <b className="text-label-tint font-normal">(60 ratings)</b></b>
                </div>
              </div>
              <div className="text-sm text-jaffa py-[1rem]">
                <b>{restaurant.description}</b>
              </div>
              <div className="flex items-center">
                <div>
                  <img className="w-[.5rem] pt-[.5rem]" src="/connecting-line.svg" alt="" />
                </div>
                <div className="flex flex-col gap-[2.5rem]">
                  <div className="flex items-center">
                    <b className="text-sm text-dark px-[1rem]">Outlet</b>
                    <b className="text-sm text-label-tint font-normal">{restaurant.location}</b>
                  </div>
                  <b className="flex flex-row text-sm text-dark px-[1rem]">25-30 mins</b>
                </div>
              </div>
              <div className="py-[1rem] flex items-center">
                <img className="w-5 text-label-tint" src="/delivery.svg" alt="" />
                <b className="text-sm text-label-tint font-light px-[1rem]">Order above 149 eligible for free delivery</b>
              </div>
            </div>
          </div>

          <div>
            <div className={`self-stretch flex flex-col items-center justify-center py-[1rem] px-[0rem] pb-[0rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
              <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
                <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
                  <h3 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
                    Deals for you
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

            <div className="scrollSection2 flex flex-col items-center py-[2rem]">
              <div
                ref={containerRef}
                className="scroll-container w-[69.5rem]"
                style={{
                  overflowX: "scroll",
                  scrollBehavior: "smooth",
                }}
              >
                <div className="flex flex-row justify-start gap-[10rem] max-w-full text-[1.413rem] text-white">
                  {SAMPLE_DATA.map((item, idx) => (
                    <div key={`${item.itemName}-${idx}`} className="w-[10rem] flex flex-col">
                      <div className="w-[18rem] rounded-2xl h-[7rem] border-[.2rem] border-solid border-selection-tint" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-[31rem] h-[.1rem] bg-selection-tint" />
          <div>
            <b>M E N U</b>
          </div>
          <div className="w-[31rem] h-[.1rem] bg-selection-tint" />
        </div>

        <div className={`w-[70.5rem] flex flex-col py-[1rem] px-[0rem] pb-[0rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
          <div className="h-full pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full">
            <h3 className="text-inherit text-dark font-bold font-[inherit] shrink-0 max-w-full px-[.5rem]">
              Top Picks
            </h3>
          </div>

          <div className="flex justify-between py-[2rem]">
            {restaurant.menuItems && restaurant.menuItems.length > 0 ? (
              // Shuffle the menu items array and then slice to get up to 3 items
              [...restaurant.menuItems]
                .sort(() => Math.random() - 0.5) // Shuffle array
                .slice(0, 3) // Take up to 3 items
                .map((item) => (
                  <div key={item._id} className="flex-col topPicksCard w-[20rem] h-[11rem] flex relative overflow-hidden rounded-3xl border-[.2rem] border-solid text-bg-white shadow-md" style={{
                    border: "8px solid white", backgroundImage: `url(${item.image})`, backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                    <b className="top-[5.8rem] left-[1rem] relative inline-block z-[2] text-2xl">{item.name.length < 16 ? item.name : (item.name.slice(0, 15) + '....')}</b>
                    <div className="top-[6rem] left-[1rem] text-mid relative z-[2]">
                      {"₹" + item.price || "Up to ₹50"} {/* Sample default */}
                    </div>
                  </div>
                ))
            ) : (
              <p>No menu items available</p> // Fallback in case of no menu items
            )}
          </div>

          <div className="divide-y-[.1rem] divide-solid divide-selection-tint">
            {[
              {
                title: "Recommended",
                filter: item => item.recommended,
                img: item => (item.veg ? "/veg.svg" : "/non-veg.svg"),
                alt: item => (item.veg ? "Veg" : "Non-Veg"),
              },
              {
                title: "Veg",
                filter: item => item.veg,
                img: () => "/veg.svg",
                alt: () => "Veg",
              },
              {
                title: "Non-Veg",
                filter: item => !item.veg,
                img: () => "/non-veg.svg",
                alt: () => "Non-Veg",
              },
              ...[...new Set(restaurant.menuItems ? restaurant.menuItems.map(item => item.category) : "")]
                .filter(Boolean)
                .map(category => ({
                  title: category,
                  filter: item => item.category === category,
                  img: item => (item.veg ? "/veg.svg" : "/non-veg.svg"),
                  alt: item => (item.veg ? "Veg" : "Non-Veg"),
                })),
            ].map((section, index) => {
              const filteredItems = restaurant.menuItems ? restaurant.menuItems.filter(section.filter) : "";
              return filteredItems.length > 0 && (
                <div key={index} className="collapse bg-bg-white rounded-none">
                  <input type="radio" name="my-accordion-1" defaultChecked={index === 0} />
                  <div className="collapse-title text-xl font-bold text-dark">
                    <b className="sectionAndCount">
                      {section.title} ({filteredItems.length})
                    </b>
                  </div>
                  <div className="collapse-content text-dark">
                    {filteredItems.map(item => (
                      <div key={item._id} className="flex items-center justify-between py-[2rem]">
                        {/* Left Content Section */}
                        <div className="flex flex-col items-start gap-2 w-2/3">
                          <div className="flex gap-2 font-bold">
                            <img className="w-5" src={section.img(item)} alt={section.alt(item)} />
                            {item.name}
                          </div>
                          <div className="text-lg flex items-center gap-3 py-2">
                            ₹{item.price}
                            <div className="text-label-tint font-bold flex gap-1">
                              <img className="w-5" src="/offer-tag.svg" alt="" />
                              <b>50% OFF USE FIRSTBITE</b>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <svg className="w-5 h-5 fill-tradewind" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                            <b className="text-lg font-medium">4.2 (12)</b>
                          </div>
                          <div className="text-mid text-label-tint w-full py-5">
                            {item.description}
                          </div>
                        </div>

                        {/* Right Background Image Section with Button */}
                        <div className="flex flex-col items-center justify-end relative w-[14rem] h-[14rem] rounded-3xl overflow-visible  shadow-md z-1"
                          style={{
                            border: "10px solid white",
                            backgroundImage: `url(${item.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'left center',
                            backgroundRepeat: "no-repeat"
                          }}>
                           
                          {/* Button or Quantity Section */}
                          {!groupedItems.find((i) => i._id === item._id) ? (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="addToCartButton absolute top-[11.5rem] w-[9rem] h-[3rem] text-mid font-bold bg-bg-white text-tradewind border-[.3rem] border-solid border-white px-3 py-1 rounded-xl shadow-md z-2 cursor-pointer"
                            >
                              <b>Add to Cart</b>
                            </button>
                          ) : (
                            <div className="absolute top-[11.5rem] w-[9rem] h-[3rem] flex items-center px-[1rem] justify-between text-tradewind text-mid font-bold gap-2 bg-bg-white border-[.3rem] border-solid border-white rounded-xl shadow-lg cursor-pointer">
                              <button
                                onClick={() => {
                                  dispatch(decrement(item._id));
                                }}
                                className="decrementButton bg-white px-2 py-1 rounded-md border-[.1rem] border-solid border-disabled-tint text-tradewind cursor-pointer"
                              >
                                -
                              </button>

                              <span className="quantityValue font-bold">
                                {groupedItems.find(cartItem => cartItem._id === item._id)?.quantity || 1}
                                {console.log(groupedItems)
                                }
                              </span>

                              <button
                                onClick={() => {
                                  handleAddToCart(item); // Ensure this function is called
                                  dispatch(increment(item._id));
                                }}
                                className="incrementButton bg-white px-2 py-1 rounded-md border-[.1rem] border-solid border-disabled-tint text-tradewind cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}

                          {/* Sticky 'View Cart' Button */}
                          {groupedItems.length > 0 && (
                            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
                              <button
                                onClick={() => {
                                  // Ensure all items have valid properties
                                  const validItems = groupedItems.every(
                                    (item) => item._id && item.name && item.price
                                  );
                                  if (validItems) {
                                    navigate('/user/checkout');
                                  } else {
                                    console.error('Cart contains invalid items');
                                  }
                                }}
                                className="bg-tradewind text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 cursor-pointer cartButton"
                              >
                                View Cart ({groupedItems.reduce((a, b) => a + b.quantity, 0)})
                                
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div >
  )
}

RestaurantHeader.propTypes = {
  className: PropTypes.string,
}
