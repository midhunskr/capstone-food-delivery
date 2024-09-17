import PropTypes from "prop-types";

export const FrameComponent4 = ({ className = "" }) => {
  return (
    <div className={`self-stretch flex flex-row items-end justify-between relative max-w-full gap-[1.25rem] text-left text-[1.313rem] text-dark font-arial-rounded-mt-bold mq1350:flex-wrap ${className}`}>
      <div className="w-[24rem] flex flex-col items-start justify-start gap-[4.593rem] max-w-full text-[2.5rem] mq450:gap-[2.313rem]">
        <h2 className="m-0 self-stretch relative text-inherit font-normal font-[inherit] mq450:text-[1.5rem] mq800:text-[2rem]">
          <span>Our</span>
          <span className="text-black">{` `}</span>
          <span className="text-jaffa">Best Delivered</span>
          <span className="text-black">{` `}</span>
          <span>Cartegories</span>
        </h2>
        <div className="w-[15.925rem] h-[20rem] flex flex-col items-end justify-start gap-[0.006rem] text-[1.313rem] text-black">
          <img
            className="self-stretch flex-1 relative max-w-full overflow-hidden max-h-full"
            loading="lazy"
            alt=""
            src="/group-67.svg"
          />
          <div className="w-[14.675rem] flex flex-row items-start justify-end py-[0rem] px-[2.062rem] box-border">
            <div className="flex-1 flex flex-col items-start justify-start gap-[0.562rem]">
              <div className="self-stretch relative mq450:text-[1.063rem]">
                Masala Chicken
              </div>
              <div className="flex flex-row items-start justify-start py-[0rem] pl-[0.937rem] pr-[1.437rem] text-jaffa font-quicksand">
                <b className="relative leading-[1.063rem] mq450:text-[1.063rem] mq450:leading-[0.875rem]">{`Order Now >`}</b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[8.125rem] flex flex-col items-start justify-start gap-[0.562rem] text-center text-black">
        <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pl-[0.312rem] pr-[0.5rem]">
          <div className="flex-1 relative inline-block min-w-[7.313rem] mq450:text-[1.063rem]">
            Soft Drinks
          </div>
        </div>
        <b className="relative leading-[1.063rem] font-quicksand text-jaffa text-left mq450:text-[1.063rem] mq450:leading-[0.875rem]">{`Order Now >`}</b>
      </div>
      <div className="w-[21.438rem] flex flex-col items-start justify-start gap-[23.031rem] max-w-full font-quicksand mq450:gap-[11.5rem]">
        <div className="self-stretch flex flex-row items-start justify-start relative max-w-full">
          <div className="h-[11.5rem] w-[11.5rem] absolute !m-[0] bottom-[-4.5rem] left-[4.25rem]" />
          <div className="h-[3rem] flex-1 relative font-semibold inline-block max-w-full z-[1] mq450:text-[1.063rem]">
            It is just not bringing your favorite food, we deliver you
            experience.
          </div>
        </div>
        <div className="self-stretch flex flex-row items-start justify-end py-[0rem] px-[3.312rem] text-black font-arial-rounded-mt-bold">
          <div className="flex flex-col items-start justify-start gap-[0.562rem]">
            <div className="flex flex-row items-start justify-start relative">
              <div className="relative mq450:text-[1.063rem]">French Fires</div>
              <img
                className="h-[17.719rem] w-[20.006rem] absolute !m-[0] top-[-17.312rem] left-[-6.887rem] z-[1]"
                loading="lazy"
                alt=""
                src="/group-69.svg"
              />
            </div>
            <div className="flex flex-row items-start justify-start py-[0rem] px-[0.062rem] text-jaffa font-quicksand">
              <b className="relative leading-[1.063rem] mq450:text-[1.063rem] mq450:leading-[0.875rem]">{`Order Now >`}</b>
            </div>
          </div>
        </div>
      </div>
      <img
        className="h-[16.219rem] w-[15.144rem] absolute !m-[0] right-[27.031rem] bottom-[4.844rem]"
        loading="lazy"
        alt=""
        src="/group-68.svg"
      />
    </div>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};