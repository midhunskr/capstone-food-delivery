import PropTypes from "prop-types"
import { AddressSection } from "../../components/user/cart/AddressSection";
import { ProceedToPayment } from "../../components/user/cart/ProceedToPayment";
import { PaymentDetails } from "../../components/user/cart/PaymentDetails";

export const CheckoutPage = ({ className = '' }) => {
    return (
        <div>
            <div className={`self-stretch flex flex-col items-center bg-bg-white text-dark justify-center pt-[2rem] px-[1.25rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
                <div className="h-full w-[70.5rem] flex flex-col items-start justify-start box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:g[1rem] mq750:pb-[11.688rem] mq750:box-border">
                    <div className="self-stretch flex flex-col items-start justify-start pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full mq450:flex-wrap">
                        <b>Select delivery address</b>
                        <b className="text-mid font-normal text-label-tint py-[.5rem]">Select your address or add a new one</b>
                    </div>

                </div>

            </div>
            <div className={`self-stretch flex flex-col items-center bg-bg-white text-dark  pt-[2rem] px-[1.25rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
                <div className="h-full w-[70.5rem] flex flex-col   box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:g[1rem] mq750:pb-[11.688rem] mq750:box-border">
                    <div className="self-stretch flex flex-col   pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full mq450:flex-wrap">
                        <div className="flex flex-row w-12/12 justify-between pb-[4rem]">
                            <div className="flex w-6/12 flex-col bg-bg-white text-dark gap-[3rem]">
                                <AddressSection />
                                {/* <ProceedToPayment /> */}
                            </div>
                            <div className=" bg-bg-white text-dark">
                                <PaymentDetails />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

CheckoutPage.propTypes = {
    className: PropTypes.string,
};