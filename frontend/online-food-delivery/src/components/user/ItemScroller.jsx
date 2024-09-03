import PropTypes from "prop-types";

export const ItemScroller = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch flex flex-row items-start justify-center py-[4rem] px-[1.25rem] box-border max-w-full text-center text-[1.5rem] text-text-dark font-montserrat ${className}`}
    >
      <div className="w-[70.5rem] flex flex-col items-start justify-between min-h-[12.563rem] max-w-full">
        <div className="self-stretch flex flex-row items-center justify-between max-w-full gap-[1.25rem] mq750:flex-wrap">
          <div className="w-[23.875rem] flex flex-row items-center justify-center py-[0rem] px-[0.937rem] box-border max-w-full">
            <h3 className="m-0 flex-1 relative text-inherit leading-[121.88%] font-bold font-[inherit] mq450:text-[1.188rem] mq450:leading-[1.438rem]">
              Hello, what’s on your mind?
            </h3>
          </div>
          <div className="w-[3.688rem] flex flex-row items-center justify-between">
            <img
              className="h-[1.625rem] w-[1.625rem] relative min-h-[1.625rem]"
              loading="lazy"
              alt=""
              src="/frame-3807.svg"
            />
            <img
              className="h-[1.625rem] w-[1.625rem] relative min-h-[1.625rem]"
              loading="lazy"
              alt=""
              src="/frame-3806.svg"
            />
          </div>
        </div>
        <div className="w-[70.5rem] h-[9.738rem] overflow-x-auto shrink-0 flex flex-row items-center justify-between py-[0rem] px-[1.75rem] box-border gap-[1.25rem] max-w-full text-[1.25rem] text-item-tint">
          <div className="w-[8.25rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/biriyani-1@2x.png"
            />
            <div className="self-stretch relative font-medium mq450:text-[1rem]">
              Biriyani
            </div>
          </div>
          <div className="w-[8.25rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/noodles-1@2x.png"
            />
            <div className="self-stretch h-[1.75rem] relative font-medium inline-block shrink-0 mq450:text-[1rem]">
              Noodles
            </div>
          </div>
          <div className="w-[7.625rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/burgers-1@2x.png"
            />
            <div className="self-stretch relative font-medium mq450:text-[1rem]">
              Burgers
            </div>
          </div>
          <div className="w-[8.25rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/pizza-5@2x.png"
            />
            <div className="self-stretch h-[1.75rem] relative font-medium inline-block shrink-0 mq450:text-[1rem]">
              Pizzas
            </div>
          </div>
          <div className="self-stretch h-[8.9rem] w-[8.25rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/rolls-1@2x.png"
            />
            <div className="self-stretch h-[1.75rem] relative font-medium inline-block shrink-0 mq450:text-[1rem]">
              Rolls
            </div>
          </div>
          <div className="w-[8.25rem] shrink-0 flex flex-col items-center justify-between">
            <img
              className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/parotta-1@2x.png"
            />
            <div className="self-stretch h-[1.75rem] relative font-medium inline-block shrink-0 mq450:text-[1rem]">
              Parotta
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ItemScroller.propTypes = {
  className: PropTypes.string,
};