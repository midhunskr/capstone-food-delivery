import PropTypes from "prop-types";
import './RestaurantListing.css'

export const RestaurantListing = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch flex flex-row items-start justify-center py-[0rem] px-[1.25rem] pb-[3rem] box-border max-w-full text-left text-[1.5rem] text-dark font-montserrat ${className}`}
    >
      <div className="h-[19.688rem] w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[17.937rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
        <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
          <h3 className="m-0 w-[20.75rem] relative text-inherit leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
            Top Restaurants near by
          </h3>
          <div className="w-[3.688rem] flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem] box-border">
            <div className="self-stretch h-[1.625rem] relative">
              <img
                className="absolute top-[0rem] left-[0rem] w-[1.625rem] h-[1.625rem]"
                loading="lazy"
                alt=""
                src="/group-3643.svg"
              />
              <img
                className="absolute top-[0rem] left-[2.063rem] w-[1.625rem] h-[1.625rem]"
                loading="lazy"
                alt=""
                src="/group-3644.svg"
              />
            </div>
          </div>
        </div>
        <div className="w-[70.5rem] flex flex-row items-end justify-start py-[0rem] px-[0.625rem] box-border gap-[2.818rem] shrink-0 max-w-full text-[1.413rem] text-white font-quicksand mq750:gap-[1.438rem]">

          {/* Restaurant Card 1 */}
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
            <div className="self-stretch flex flex-col items-start justify-end  relative gap-[0.556rem]">             
              <div className="restaurantCard w-[15rem] h-[11rem]">
                <b className="w-[6.3rem] top-[6rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                  10% OFF
                </b>
                <div className="w-[4.669rem] top-[7.7rem] right-[5.2rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                  Up to ₹70
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[0.75rem] text-black font-montserrat">
              <div className="flex flex-row items-start justify-start">
                <b className="relative mq450:text-[1.125rem] left-[.5rem]">
                  Hotel Saravana....
                </b>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint font-quicksand">
                <img
                  className="h-[1.45rem] w-[1.519rem] left-[.5rem] relative object-cover min-h-[1.438rem]"
                  loading="lazy"
                  alt=""
                  src="/frame-3830@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                  <b className="relative inline-block min-w-[3.581rem] left-[.7rem]">
                    31 mins
                  </b>
                </div>
              </div>
            </div>
          </div>

          

          {/* Restaurant Card 1 */}
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
            <div className="self-stretch flex flex-col items-start justify-end  relative gap-[0.556rem]">             
              <div className="restaurantCard w-[15rem] h-[11rem]">
                <b className="w-[6.3rem] top-[6rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                  10% OFF
                </b>
                <div className="w-[4.669rem] top-[7.7rem] right-[5.2rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                  Up to ₹70
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[0.75rem] text-black font-montserrat">
              <div className="flex flex-row items-start justify-start">
                <b className="relative mq450:text-[1.125rem] left-[.5rem]">
                  Hotel Saravana....
                </b>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint font-quicksand">
                <img
                  className="h-[1.45rem] w-[1.519rem] left-[.5rem] relative object-cover min-h-[1.438rem]"
                  loading="lazy"
                  alt=""
                  src="/frame-3830@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                  <b className="relative inline-block min-w-[3.581rem] left-[.7rem]">
                    31 mins
                  </b>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Card 1 */}
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
            <div className="self-stretch flex flex-col items-start justify-end  relative gap-[0.556rem]">             
              <div className="restaurantCard w-[15rem] h-[11rem]">
                <b className="w-[6.3rem] top-[6rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                  10% OFF
                </b>
                <div className="w-[4.669rem] top-[7.7rem] right-[5.2rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                  Up to ₹70
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[0.75rem] text-black font-montserrat">
              <div className="flex flex-row items-start justify-start">
                <b className="relative mq450:text-[1.125rem] left-[.5rem]">
                  Hotel Saravana....
                </b>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint font-quicksand">
                <img
                  className="h-[1.45rem] w-[1.519rem] left-[.5rem] relative object-cover min-h-[1.438rem]"
                  loading="lazy"
                  alt=""
                  src="/frame-3830@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                  <b className="relative inline-block min-w-[3.581rem] left-[.7rem]">
                    31 mins
                  </b>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant Card 1 */}
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
            <div className="self-stretch flex flex-col items-start justify-end  relative gap-[0.556rem]">             
              <div className="restaurantCard w-[15rem] h-[11rem]">
                <b className="w-[6.3rem] top-[6rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                  10% OFF
                </b>
                <div className="w-[4.669rem] top-[7.7rem] right-[5.2rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                  Up to ₹70
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[0.75rem] text-black font-montserrat">
              <div className="flex flex-row items-start justify-start">
                <b className="relative mq450:text-[1.125rem] left-[.5rem]">
                  Hotel Saravana....
                </b>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint font-quicksand">
                <img
                  className="h-[1.45rem] w-[1.519rem] left-[.5rem] relative object-cover min-h-[1.438rem]"
                  loading="lazy"
                  alt=""
                  src="/frame-3830@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                  <b className="relative inline-block min-w-[3.581rem] left-[.7rem]">
                    31 mins
                  </b>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

RestaurantListing.propTypes = {
  className: PropTypes.string,
};