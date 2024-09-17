import PropTypes from "prop-types"

export const ProceedToPayment = () => {
    return (
        <div className="w-12/12">
            <div className="py-[1rem] border-2 border-solid border-selection-tint rounded-2xl">
                <div className="px-[2rem] py-[2rem]">
                    <div className="bg-tradewind flex items-center justify-center w-[18rem] h-[3rem] text-bg-white rounded-xl cursor-pointer border-[.3rem] border-solid border-white shadow-lg">
                        <b>Proceed to Payment</b>
                    </div>
                </div>
            </div>
        </div>
    )
}

ProceedToPayment.propTypes = {
    className: PropTypes.string
}