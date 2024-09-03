import PropTypes from "prop-types";

export const Header = () => {
  return (
    <header className="self-stretch shadow-[0px_4px_45.6px_-19px_rgba(0,_0,_0,_0.25)] bg-bg-white overflow-hidden flex flex-row items-end justify-center py-[27px] px-5 gap-[232px] top-[0] z-[99] sticky text-center text-5xs text-white font-montserrat mq450:gap-[29px] mq750:gap-[58px] mq1125:gap-[116px]">
        <div className="w-[145.8px] flex flex-col items-start justify-end pt-0 px-0 pb-[4.8px] box-border">
          <div className="self-stretch flex flex-col items-end justify-start gap-[8.9px]">
            <img
              className="self-stretch h-[22.9px] relative max-w-full overflow-hidden shrink-0"
              loading="lazy"
              alt=""
              src="/group-42.svg"
            />
            <div className="w-[61px] flex flex-row items-start justify-start pt-[2.3px] pb-[4.9px] pl-[5px] pr-1 box-border relative shrink-0">
              <img
                className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-cover"
                loading="lazy"
                alt=""
                src="/group-43@2x.png"
              />
              <a className="[text-decoration:none] flex-1 relative font-bold text-[inherit] inline-block min-w-[51px] whitespace-nowrap z-[1]">
                ESTD. 2003
              </a>
            </div>
          </div>
        </div>
        <div className="overflow-hidden flex flex-row items-start justify-start py-[17.7px] px-px gap-[29.6px] text-left text-base-5 text-dark">
          <div className="flex flex-row items-start justify-start gap-[14.8px]">
            <div className="flex flex-col items-start justify-start pt-[4.8px] px-0 pb-0">
              <img
                className="w-[12.4px] h-[12.4px] relative"
                loading="lazy"
                alt=""
                src="/group-33.svg"
              />
            </div>
            <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[59.1px]">
              Search
            </a>
          </div>
          <div className="flex flex-row items-end justify-start py-0 pl-0 pr-[15px] gap-[15px]">
            <div className="flex flex-col items-start justify-end pt-0 px-0 pb-[3.7px]">
              <img
                className="w-[13.8px] h-[13.8px] relative"
                loading="lazy"
                alt=""
                src="/frame-41.svg"
              />
            </div>
            <div className="flex flex-row items-start justify-start">
              <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[53.2px]">
                Offers
              </a>
            </div>
          </div>
          <div className="flex flex-row items-start justify-start gap-[12.2px]">
            <div className="flex flex-col items-start justify-start pt-[3.6px] px-0 pb-0">
              <img
                className="w-[13.8px] h-[13.8px] relative"
                loading="lazy"
                alt=""
                src="/group-40.svg"
              />
            </div>
            <a className="[text-decoration:none] relative font-semibold text-[inherit]">
              <p className="m-0">Help</p>
            </a>
          </div>
        </div>
        <div className="w-[190px] flex flex-col items-start justify-end pt-0 px-0 pb-[6.3px] box-border">
          <div className="self-stretch flex flex-row items-start justify-start">
            <div className="flex-1 flex flex-row items-end justify-start gap-[23.8px]">
              <div className="flex flex-col items-start justify-end pt-0 px-0 pb-[1.4px]">
                <img
                  className="w-10 h-[41px] relative"
                  loading="lazy"
                  alt=""
                  src="/group-37.svg"
                />
              </div>
              <button className="cursor-pointer [border:none] pt-[7.6px] pb-[7.7px] pl-[13px] pr-3 bg-tradewind flex-1 rounded-17xl flex flex-row items-start justify-start gap-[18px]">
                <img
                  className="h-[28.7px] w-[28.7px] relative overflow-hidden shrink-0"
                  alt=""
                  src="/login-1.svg"
                />
                <div className="flex-1 flex flex-col items-start justify-start pt-1 px-0 pb-0">
                  <a className="[text-decoration:none] self-stretch relative text-mid-5 font-arial-rounded-mt-bold text-bg-white text-left whitespace-nowrap">
                    Login
                  </a>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>
  );
};

Header.propTypes = {
  className: PropTypes.string,
};