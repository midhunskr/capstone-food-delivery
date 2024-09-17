import PropTypes from "prop-types"
import { loadStripe } from '@stripe/stripe-js'
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { addToCart, decrement, increment } from "../../../redux/features/cartSlice"
import { axiosInstance } from "../../../config/axioInstance"
import { useNavigate } from "react-router-dom"

export const PaymentDetails = () => {

    //Import cart item data from Redux
    const [quantityItems, setQuantityItems] = useState({})
    const cartItems = useSelector((state) => {
        console.log("Updated cart items after decrement:", state.cart.cartItems); // Log the updated state
        return state.cart.cartItems;
    });
    const navigate = useNavigate()
    const dispatch = useDispatch()

    //Add to cart
    const handleAddToCart = (item) => {

        setQuantityItems((prevState) => ({
            ...prevState,
            [item._id]: { ...item, quantity: 0 },
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
    console.log(groupedItems);
    

    //Price calculation
    const totalPrice = groupedItems.reduce((total, item) => {
        const itemTotalPrice = item.price * item.quantity
        return total + itemTotalPrice;
    }, 0)

    const deliveryFee = 35
    const taxRate = (totalPrice * 18) / 100
    const grandTotal = totalPrice + deliveryFee + taxRate;

    const makePayment = async () => {
        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_Publishable_key);

            // Prepare data to send to the backend 
            const orderData = {
                menuItems: groupedItems.map(item => ({
                    ...item,
                    images: [item.image],
                    price: Number(item.price)
                })),
                totalPrice,
                deliveryFee,
                taxRate,
                grandTotal,
                customerName: 'John Doe', // Get this from your frontend form
                customerAddress: {
                    line1: '123 Main St',
                    city: 'New York',
                    state: 'KL',
                    country: 'IN',
                    postal_code: '10001'
                }
            };
            console.log("orderData================", orderData);

            const response = await axiosInstance({
                url: "/payment/create",
                method: "POST",
                data: orderData,  // Send the entire orderData object
                withCredentials: true
            });

            console.log("response.data=========", response.data);

            const sessionId = response?.data?.sessionId;

            const result = stripe.redirectToCheckout({
                sessionId: sessionId
            });

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="w-[30rem]">
            <div className="py-[2rem] px-[2rem] h-auto flex flex-col gap-[2rem] border-2 border-solid border-selection-tint rounded-2xl">
                <div className="flex gap-3">
                    <div className="w-[6rem] h-[6rem] border-4 border-solid border-white rounded-xl shadow-md" style={{
                        backgroundImage: `url(${groupedItems[0]?.image})`, backgroundSize: 'cover',
                        backgroundPosition: 'left center',
                    }} />
                    <div className="flex flex-col gap-3">
                        <b className="restaurantName text-xl text-dark">{groupedItems[0].restaurantName}</b>
                        <b className="restaurantName text-mid text-label-tint font-normal">{groupedItems[0].restaurantLocation}</b>
                    </div>
                </div>
                <div>
                    <div className="pb-[1rem]">
                        <div className="w-full border-[.08rem] border-solid border-selection-tint" />
                    </div>
                    <div className="itemScroll overflow-y-auto h-[10rem]">
                        {groupedItems.map(item => (
                            <div key={item._id} className="itemImageSection flex justify-between items-center py-[1rem]">
                                <div className="flex gap-3 w-[8.7rem]">
                                    {item.veg ? (
                                        <img
                                            src="/veg.svg"
                                            alt="veg"
                                            className="w-[1rem] h-auto"
                                        />
                                    ) : (
                                        <img
                                            src="/non-veg.svg"
                                            alt="non-veg"
                                            className="w-[1rem] h-auto"
                                        />
                                    )}
                                    <b className="text-mid text-dark font-normal">{item.name}</b>
                                </div>
                                <div className="w-[7rem] h-[2rem] flex items-center justify-between px-[1rem] text-tradewind text-mid font-bold gap-3 bg-bg-white border-[.3rem] border-solid border-white rounded-lg shadow-lmd">
                                    <button
                                        onClick={() => {
                                            dispatch(decrement(item._id)); 
                                        
                                            // // Access updated cartItems after the decrement
                                            // const updatedCartItems = useSelector(state => state.cart.cartItems); 
                                        
                                            // Check if the item's quantity is now 0
                                            const updatedItem = groupedItems.find(cartItem => cartItem._id === item._id);
                                            if (updatedItem && updatedItem.quantity === 0) {
                                              // Redirect to another component (replace '/other-route' with your actual route)
                                              <b>Your cart is empty</b> 
                                            }
                                          }}
                                        className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">
                                        -
                                    </button>
                                    <span className="font-bold">{cartItems.find(cartItem => cartItem._id === item._id)?.quantity || 1}</span>
                                    <button
                                        onClick={() => {
                                            handleAddToCart(item); // Ensure this function is called
                                            dispatch(increment(item._id));

                                            setQuantityItems((prevState) => {
                                                // Ensure prevState is always an array
                                                const validState = Array.isArray(prevState) ? prevState : [];

                                                return validState.map(i =>
                                                    i._id === item._id ? { ...i, quantity: (i.quantity || 0) + 1 } : i
                                                );
                                            });
                                        }}
                                        className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">
                                        +
                                    </button>
                                </div>
                                <b className="font-normal text-mid">₹{item.price}</b>
                            </div>
                        ))}
                    </div>
                    <div className="pt-[2rem]">
                        <b>Bill details</b>
                        <div className="flex justify-between pt-5">
                            <b className="text-label-tint font-normal text-mid">Item Total</b>
                            <b className="text-label-tint font-normal text-mid">₹{totalPrice}</b>
                        </div>
                        <div className="flex justify-between py-5">
                            <b className="text-label-tint font-normal text-mid">Delivery Fee</b>
                            <b className="text-label-tint font-normal text-mid">₹{deliveryFee}</b>
                        </div>
                        <div className="py-[.5rem]">
                            <div className="w-full border-[.08rem] border-solid border-selection-tint" />
                        </div>
                        <div className="flex justify-between py-[1rem]">
                            <b className="text-label-tint font-normal text-mid">GST & Restaurant Charges</b>
                            <b className="text-label-tint font-normal text-mid">₹{taxRate}</b>
                        </div>
                        <div className="pb-[2rem] pt-[1rem]">
                            <div className="w-full border-[.1rem] border-solid border-tradewind" />
                        </div>
                        <div onClick={makePayment} className="flex justify-between py-[1rem] bg-tradewind items-center w-full h-[3rem] px-[1rem] text-bg-white text-xl rounded-[.5rem] cursor-pointer shadow-lg">
                            <b>TO PAY</b>
                            <b>₹{grandTotal}</b>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PaymentDetails.propTypes = {
    className: PropTypes.string
}