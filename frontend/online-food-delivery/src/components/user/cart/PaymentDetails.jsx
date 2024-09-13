import PropTypes from "prop-types"
import { useState } from "react"
// import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
// import { decrement, increment } from "../../../redux/features/counterSlice"
// import { axiosInstance } from "../../../config/axioInstance"


export const PaymentDetails = () => {

    //Import cart item data from Redux
    const [quantityItems, setQuantityItems] = useState({})
    const itemsQuantity = useSelector((state) => state.cart.cartItems)
    
    // //Payment
    // const makePayment = async () => {
    //     try {
    //         const stripe = await loadStripe(import.meta.env.VITE_STRIPE_Publishable_key)

    //         const session = await axiosInstance({
    //             url: "/order/create",
    //             method: "POST",

    //         })

    //     } catch (error) {
    //         console.log(error);          
    //     }
    // }

    const groupedItems = itemsQuantity.reduce((acc, item) => {
        const existingItem = acc.find(i => i.name === item.name);
      
        if (existingItem) {
          // If item with the same name exists, increment the quantity
          existingItem.quantity += 1;
        } else {
          // Otherwise, add the item to the accumulator with quantity 1
          acc.push({ ...item, quantity: 1 });
        }
      
        return acc;
    }, []);

    const totalPrice = groupedItems.reduce((total, item) => {
        const itemTotalPrice = item.price * item.quantity
        return total + itemTotalPrice;
    }, 0)
    
    const deliveryFee = 35
    const taxRate = (totalPrice*18)/100
    
    const grandTotal = totalPrice + deliveryFee + taxRate;

    return (
        <div className="w-[30rem]">
            <div className="py-[2rem] px-[2rem] h-auto flex flex-col gap-[2rem] border-2 border-solid border-selection-tint rounded-2xl">
                <div className="flex gap-3">
                    <div className="w-[6rem] h-[6rem] border-4 border-solid border-white rounded-xl shadow-md" style={{
                        backgroundImage: `url(${itemsQuantity[0].image})`, backgroundSize: 'cover',
                        backgroundPosition: 'left center'
                    }} />
                    <div className="flex flex-col gap-3">
                        <b className="restaurantName text-xl text-dark">{itemsQuantity[0].restaurantName}</b>
                        <b className="restaurantName text-mid text-label-tint font-normal">{itemsQuantity[0].restaurantLocation}</b>
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
                                <button className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">
                                    -
                                </button>
                                <span className="font-bold">{item.quantity}</span>
                                <button className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">
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
                        <div className="flex justify-between py-[1rem] bg-tradewind items-center w-full h-[3rem] px-[1rem] text-bg-white rounded-xl cursor-pointer border-[.3rem] border-solid border-white shadow-lg">
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