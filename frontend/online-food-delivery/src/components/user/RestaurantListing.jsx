import PropTypes from "prop-types";

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
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
            <div className="self-stretch flex flex-col items-start justify-end pt-[6.937rem] px-[0.875rem] pb-[0.756rem] relative gap-[0.556rem]">
              <img
                className="w-full h-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
                loading="lazy"
                alt=""
                src="/frame-3835@2x.png"
              />
              <div className="w-full h-full !m-[0] absolute top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] flex flex-row items-start justify-start z-[1]">
                <div className="self-stretch flex-1 relative rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))]" />
              </div>
              <b className="w-[6.3rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                10% OFF
              </b>
              <div className="w-[4.669rem] relative text-[0.869rem] font-semibold inline-block z-[2]">
                Up to ₹70
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[0.75rem] text-black font-montserrat">
              <div className="flex flex-row items-start justify-start">
                <b className="relative mq450:text-[1.125rem]">
                  Hotel Saravana....
                </b>
              </div>
              <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint font-quicksand">
                <img
                  className="h-[1.45rem] w-[1.519rem] relative object-cover min-h-[1.438rem]"
                  loading="lazy"
                  alt=""
                  src="/frame-3830@2x.png"
                />
                <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                  <b className="relative inline-block min-w-[3.581rem]">
                    31 mins
                  </b>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[0.937rem]">
            <div className="self-stretch rounded-[17.37px] flex flex-col items-start justify-end pt-[6.937rem] px-[0.875rem] pb-[0.756rem] relative gap-[0.375rem] bg-[url('/offer-details@3x.png')] bg-cover bg-no-repeat bg-[top]">
              <div className="w-[calc(100%_+_17.4px)] h-[calc(100%_+_17.4px)] absolute !m-[0] top-[0rem] right-[-1.087rem] bottom-[-1.087rem] left-[0rem] rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))] border-white border-[8.7px] border-solid box-border" />
              <b className="w-[6.3rem] relative inline-block z-[1] mq450:text-[1.125rem]">
                15% OFF
              </b>
              <div className="w-[4.669rem] relative text-[0.869rem] font-semibold inline-block z-[1]">
                Up to ₹70
              </div>
            </div>
            <div className="flex flex-row items-start justify-start text-black font-montserrat">
              <b className="relative mq450:text-[1.125rem]">
                KFC Fried Chicken
              </b>
            </div>
            <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint">
              <img
                className="h-[1.45rem] w-[1.519rem] relative object-cover min-h-[1.438rem] shrink-0"
                loading="lazy"
                alt=""
                src="/frame-3854@2x.png"
              />
              <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                <b className="relative inline-block min-w-[3.625rem] shrink-0">
                  25 mins
                </b>
              </div>
            </div>
          </div>
          <div className="h-[15.931rem] w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[0.937rem]">
            <div className="self-stretch h-[11.944rem] rounded-[17.37px] flex flex-col items-start justify-end pt-[8.025rem] px-[0.875rem] pb-[1.018rem] box-border relative gap-[0.375rem] bg-[url('/frame-3839@3x.png')] bg-cover bg-no-repeat bg-[top] shrink-0">
              <div className="w-full h-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] rounded-[17.37px] [background:linear-gradient(180deg,_rgba(0,_0,_0,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))]" />
              <b className="relative inline-block min-w-[6.3rem] z-[1] mq450:text-[1.125rem]">
                35% OFF
              </b>
              <div className="w-[4.669rem] relative text-[0.869rem] font-semibold inline-block z-[1]">
                Up to ₹70
              </div>
            </div>
            <div className="flex flex-row items-start justify-start text-black font-montserrat">
              <b className="relative inline-block min-w-[7rem] mq450:text-[1.125rem]">
                Pizza Hut
              </b>
            </div>
            <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint">
              <img
                className="h-[1.45rem] w-[1.281rem] relative object-cover min-h-[1.438rem]"
                loading="lazy"
                alt=""
                src="/frame-3841@2x.png"
              />
              <div className="flex flex-col items-start justify-start pt-[0.131rem] px-[0rem] pb-[0rem]">
                <b className="relative inline-block min-w-[4.313rem]">
                  40 mins
                </b>
              </div>
            </div>
          </div>
          <div className="h-[15.919rem] w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[0.937rem]">
            <div className="w-[16.288rem] h-[11.944rem] rounded-[17.37px] flex flex-col items-start justify-end pt-[6.943rem] px-[0.812rem] pb-[0.762rem] box-border relative gap-[0.362rem] bg-[url('/public/rectangle-13@2x.png')] bg-cover bg-no-repeat bg-[top] shrink-0">
              <img
                className="w-[15.2rem] h-[10.856rem] relative rounded-[17.37px] object-cover hidden z-[0]"
                alt=""
                src="/rectangle-13@2x.png"
              />
              <div className="w-full h-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(2,_2,_2,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))] z-[1]" />
              <b className="w-[6.3rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                10% OFF
              </b>
              <div className="w-[5.306rem] flex flex-row items-start justify-start py-[0rem] px-[0.312rem] box-border text-[0.869rem]">
                <div className="flex-1 relative font-semibold z-[2]">
                  Up to ₹70
                </div>
              </div>
            </div>
            <b className="w-[14.113rem] relative inline-block font-montserrat text-black mq450:text-[1.125rem]">
              Fruit Bae
            </b>
            <div className="flex flex-row items-start justify-start gap-[0.437rem] text-[0.975rem] text-label-tint">
              <img
                className="h-[1.45rem] w-[1.281rem] relative object-cover min-h-[1.438rem]"
                loading="lazy"
                alt=""
                src="/frame-3844@2x.png"
              />
              <div className="flex flex-col items-start justify-start pt-[0.087rem] px-[0rem] pb-[0rem]">
                <b className="relative inline-block min-w-[3.625rem]">
                  25 mins
                </b>
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