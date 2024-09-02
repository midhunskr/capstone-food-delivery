import PropTypes from "prop-types";

export const CuisineListing = ({ className = "" }) => {
  return (
    <div
      className={`self-stretch flex flex-row items-start justify-center py-[0rem] px-[1.25rem] box-border max-w-full text-left text-[1.5rem] text-dark font-montserrat ${className}`}
    >
      <div className="w-[70.5rem] flex flex-col items-start justify-start gap-[1.956rem] max-w-full mq750:gap-[1rem]">
        <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] gap-[1.25rem] mq450:flex-wrap">
          <h3 className="m-0 w-[19.438rem] relative text-inherit leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 mq450:text-[1.188rem] mq450:leading-[1.438rem]">
            Top Cuisines near by
          </h3>
          <div className="flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
            <div className="flex flex-row items-start justify-start gap-[0.437rem]">
              <div className="flex flex-col items-center justify-between py-[0.812rem] px-[0.562rem] box-border relative min-h-[1.625rem]">
                <img
                  className="w-full h-full absolute !m-[0] top-[0rem] left-[0rem]"
                  alt=""
                  src="/frame-3828.svg"
                />
                <img
                  className="w-[0.5rem] h-[0rem] relative z-[1]"
                  loading="lazy"
                  alt=""
                  src="/frame-3827.svg"
                />
              </div>
              <div className="flex flex-col items-center justify-between py-[0.812rem] px-[0.562rem] box-border relative min-h-[1.625rem]">
                <img
                  className="w-full h-full absolute !m-[0] top-[0rem] left-[0rem]"
                  alt=""
                  src="/frame-3825.svg"
                />
                <img
                  className="w-[0.5rem] h-[0rem] relative z-[1]"
                  loading="lazy"
                  alt=""
                  src="/frame-3824.svg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-[70.5rem] overflow-x-auto flex flex-row items-start justify-start py-[0rem] px-[0.625rem] box-border gap-[2.818rem] max-w-full text-[1.413rem] text-white mq750:gap-[1.438rem]">
          <div className="w-[15.2rem] shrink-0 flex flex-row items-start justify-start pt-[7.981rem] px-[1rem] pb-[1.243rem] box-border relative">
            <img
              className="h-full w-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/frame-3822@2x.png"
            />
            <div className="h-full w-full !m-[0] absolute top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] flex flex-row items-start justify-start z-[1]">
              <div className="self-stretch flex-1 relative rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))]" />
            </div>
            <b className="w-[6.3rem] relative inline-block shrink-0 z-[2] mq450:text-[1.125rem]">
              Punjabi
            </b>
          </div>
          <div className="w-[15.2rem] shrink-0 flex flex-row items-start justify-start pt-[7.981rem] px-[0.875rem] pb-[1.243rem] box-border relative">
            <img
              className="h-full w-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/frame-3811@2x.png"
            />
            <div className="h-full w-full !m-[0] absolute top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] flex flex-row items-start justify-start z-[1]">
              <div className="h-[11.944rem] w-[16.288rem] relative rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))] border-white border-[8.7px] border-solid box-border shrink-0" />
            </div>
            <b className="relative inline-block min-w-[6.3rem] z-[2] mq450:text-[1.125rem]">
              Chinese
            </b>
          </div>
          <div className="w-[15.2rem] shrink-0 flex flex-row items-start justify-start pt-[7.981rem] px-[0.875rem] pb-[1.25rem] box-border relative">
            <img
              className="h-full w-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/frame-3818@2x.png"
            />
            <div className="h-full w-full !m-[0] absolute top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] flex flex-row items-start justify-start z-[1]">
              <div className="self-stretch flex-1 relative rounded-[17.37px] [background:linear-gradient(180deg,_rgba(0,_0,_0,_0),_rgba(0,_0,_0,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))]" />
            </div>
            <b className="relative z-[2] mq450:text-[1.125rem]">South Indian</b>
          </div>
          <div className="w-[15.2rem] shrink-0 flex flex-row items-start justify-start pt-[7.981rem] px-[0.875rem] pb-[1.25rem] box-border relative">
            <img
              className="h-full w-full absolute !m-[0] top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] max-w-full overflow-hidden max-h-full object-cover"
              loading="lazy"
              alt=""
              src="/frame-3814@2x.png"
            />
            <div className="h-full w-full !m-[0] absolute top-[0rem] right-[0rem] bottom-[0rem] left-[0rem] flex flex-row items-start justify-start z-[1]">
              <div className="self-stretch flex-1 relative rounded-[17.37px] [background:linear-gradient(180deg,_rgba(217,_217,_217,_0),_rgba(2,_2,_2,_0.35)_38.5%,_rgba(0,_0,_0,_0.6)_67.5%,_rgba(0,_0,_0,_0.7))]" />
            </div>
            <b className="relative inline-block min-w-[6.875rem] z-[2] mq450:text-[1.125rem]">
              Sea Food
            </b>
          </div>
        </div>
      </div>
    </div>
  );
};

CuisineListing.propTypes = {
  className: PropTypes.string,
};