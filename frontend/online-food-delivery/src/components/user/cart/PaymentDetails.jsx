import PropTypes from "prop-types"
import { loadStripe } from '@stripe/stripe-js'
import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "../../../redux/features/counterSlice"
import { axiosInstance } from "../../../config/axioInstance"


export const PaymentDetails = () => {
    const itemsQuantity = useSelector((state) => state.counter.items) //Counter Redux
    const dispatch = useDispatch()
    const order = [
        {
            _id: "66e0324a94d4672a332c7a39",
            user: {
                _id: "66c3642bae922f11cb15065b",
                name: "Midhun",
                email: "midhund@email.com"
            },
            restaurant: {
                id: "66dafb6de6471fb01207b207",
                name: "Hotel Saravana Bhavan",
                location: "Perumbavoor"
            },
            menuItems: [
                {
                    menuItem: null,
                    name: "Masala Dosa",
                    price: 75,
                    image: "https://res.cloudinary.com/dpjnptzk3/image/upload/v1725627244/tgv6o7wesypykdlxpk4c.png",
                    veg: true,
                    quantity: 2,
                    _id: "66e0324a94d4672a332c7a3a"
                },
                {
                    menuItem: null,
                    name: "Idli",
                    price: 50,
                    image: "https://res.cloudinary.com/dpjnptzk3/image/upload/v1725627244/qeywfmmlznkzfrdvznhb.png",
                    veg: true,
                    quantity: 1,
                    _id: "66e0324a94d4672a332c7a3b"
                },
                {
                    menuItem: null,
                    name: "Idli",
                    price: 50,
                    image: "https://res.cloudinary.com/dpjnptzk3/image/upload/v1725627244/qeywfmmlznkzfrdvznhb.png",
                    veg: true,
                    quantity: 1,
                    _id: "66e0324a94d4672a332c4a3b"
                },
                {
                    menuItem: null,
                    name: "Idli",
                    price: 50,
                    image: "https://res.cloudinary.com/dpjnptzk3/image/upload/v1725627244/qeywfmmlznkzfrdvznhb.png",
                    veg: true,
                    quantity: 1,
                    _id: "66e0324a94d4672b332c7a3b"
                }
            ],
            totalPrice: 262.5,
            status: "pending",
            deliveryAddress: "123 Main St, Perumbavoor",
            deliveryFee: 50,
            taxRate: 0.05,
            createdAt: "2024-09-10T11:49:30.192Z",
            updatedAt: "2024-09-10T11:49:30.192Z",
            __v: 0
        }
    ]

    const makePayment = async () => {
        try {
            const stripe = await loadStripe(import.meta.env.VITE_STRIPE_Publishable_key)

            const session = await axiosInstance({
                url: "/order/create",
                method: "POST",
                
            })

        } catch (error) {
            console.log(error);          
        }
    }


    return (
        <div className="w-12/12">
            <div className="py-[2rem] px-[2rem] h-auto flex flex-col gap-[2rem] border-2 border-solid border-selection-tint rounded-2xl">
                <div className="flex gap-3">
                    <div className="w-[6rem] h-[6rem] border-4 border-solid border-white rounded-xl shadow-md" style={{
                        backgroundImage: `url(${order[0].menuItems[0].image})`, backgroundSize: 'cover',
                        backgroundPosition: 'left center'
                    }} />
                    <div className="flex flex-col gap-3">
                        <b className="restaurantName text-xl text-dark">{order[0].restaurant.name}</b>
                        <b className="restaurantName text-mid text-label-tint font-normal">{order[0].restaurant.location}</b>
                    </div>
                </div>
                <div>
                    <div className="pb-[1rem]">
                        <div className="w-full border-[.08rem] border-solid border-selection-tint" />
                    </div>
                    <div className="itemScroll overflow-y-auto h-[10rem]">
                        {order[0].menuItems.map(item => (
                            <div key={item._id} className="itemImageSection flex justify-between items-center py-[1rem]">
                                <div className="flex gap-3 w-[8.7rem]">
                                    {item.veg ? (
                                        <img
                                            src={"/veg.svg"}
                                            alt={order[0].menuItems[0].name}
                                            className="w-[1rem] h-auto"
                                        />) : (
                                        <img
                                            src={"/non-veg.svg"}
                                            alt={order[0].menuItems[0].name}
                                            className="w-[1rem] h-auto"
                                        />
                                    )}
                                    <b className="text-mid text-dark font-normal">{item.name}</b>
                                </div>
                                <div className="w-[7rem] h-[2rem] flex items-center justify-between px-[1rem] text-tradewind text-mid font-bold gap-3 bg-bg-white border-[.3rem] border-solid border-white rounded-lg shadow-lmd">
                                    <button onClick={() => dispatch(decrement(item._id))} className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">-</button>
                                    <span className="font-bold">{itemsQuantity[item._id] || item.quantity}</span>
                                    <button onClick={() => dispatch(increment(item._id))} className="bg-transparent text-xl font-bold flex justify-center rounded-md text-tradewind cursor-pointer">+</button>
                                </div>
                                <b className="font-normal text-mid">₹{item.price}</b>
                            </div>
                        ))}
                    </div>
                    <div className="pt-[2rem]">
                        <b>Bill details</b>
                        <div className="flex justify-between pt-5">
                            <b className="text-label-tint font-normal text-mid">Item Toal</b>
                            <b className="text-label-tint font-normal text-mid">₹{order[0].totalPrice}</b>
                        </div>
                        <div className="flex justify-between py-5">
                            <b className="text-label-tint font-normal text-mid">Delivery Fee</b>
                            <b className="text-label-tint font-normal text-mid">₹{order[0].deliveryFee}</b>
                        </div>
                        <div className="py-[.5rem]">
                            <div className="w-full border-[.08rem] border-solid border-selection-tint" />
                        </div>
                        <div className="flex justify-between py-[1rem]">
                            <b className="text-label-tint font-normal text-mid">GST & Restaurant Charges</b>
                            <b className="text-label-tint font-normal text-mid">₹{order[0].taxRate}</b>
                        </div>
                        <div className="pb-[2rem] pt-[1rem]">
                            <div className="w-full border-[.1rem] border-solid border-tradewind" />
                        </div>
                        <div onClick={makePayment} className="flex justify-between py-[1rem] bg-tradewind items-center w-full h-[3rem] px-[1rem] text-bg-white rounded-xl cursor-pointer border-[.3rem] border-solid border-white shadow-lg">
                            <b>TO PAY</b>
                            <b>₹{order[0].totalPrice}</b>
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