import PropTypes from "prop-types";

const Footer2Dark = ({ className = "" }) => {
  return (
    <footer
      className={`self-stretch [background:linear-gradient(#2b2b2b,_#2b2b2b),_#fff] overflow-hidden flex flex-col items-center justify-start py-[73px] pl-5 pr-[21px] box-border gap-[158px] max-h-[512px] max-w-full text-left text-lg text-white font-montserrat mq450:gap-5 mq750:gap-[39px] mq750:pt-[47px] mq750:pb-[47px] mq750:box-border mq1125:gap-[79px] ${className}`}
    >
      <div className="w-[1074px] flex flex-row items-start justify-between gap-5 max-w-full mq1025:flex-wrap">
        <div className="flex flex-col items-start justify-start gap-2.5 text-xl">
          <div className="w-[147.8px] flex flex-row items-start justify-start pt-0 px-px pb-[7px] box-border">
            <div className="flex-1 flex flex-col items-end justify-start gap-[8.9px]">
              <img
                className="self-stretch h-[22.9px] relative max-w-full overflow-hidden shrink-0"
                loading="lazy"
                alt=""
                src="/group-42.svg"
              />
              <img
                className="w-[61px] h-[15.2px] relative object-cover shrink-0"
                loading="lazy"
                alt=""
                src="/group-43@2x.png"
              />
            </div>
          </div>
          <div className="relative leading-[32px] font-semibold mq450:text-base mq450:leading-[26px]">
            +1 (7635) 547-12-97
          </div>
          <div className="relative text-base leading-[32px] font-semibold">
            support@lift.agency
          </div>
        </div>
        <div className="flex flex-col items-start justify-start py-0 pl-0 pr-[3px] gap-[43px]">
          <div className="flex flex-col items-start justify-start gap-[25px]">
            <div className="relative leading-[28px] font-semibold inline-block min-w-[109px]">
              Quick Links
            </div>
            <div className="relative text-base font-semibold text-gray-200 inline-block min-w-[67px]">
              Product
            </div>
          </div>
          <div className="relative text-base font-semibold text-gray-200 inline-block min-w-[99px]">
            Information
          </div>
        </div>
        <div className="w-[154.5px] flex flex-col items-start justify-start pt-[53px] px-0 pb-0 box-border text-base text-gray-200">
          <div className="flex flex-col items-start justify-start gap-[43px]">
            <div className="relative font-semibold inline-block min-w-[80px]">
              Company
            </div>
            <div className="relative font-semibold inline-block min-w-[82px]">
              Lift Media
            </div>
          </div>
        </div>
        <div className="w-[248px] flex flex-col items-start justify-start gap-[25px]">
          <div className="flex flex-row items-start justify-start py-0 px-[13px]">
            <div className="relative leading-[28px] font-semibold inline-block min-w-[92px]">
              Subscribe
            </div>
          </div>
          <div className="self-stretch rounded-md bg-white border-navy border-[1px] border-solid flex flex-row items-start justify-start py-0 pl-[15px] pr-0 gap-[33px]">
            <div className="self-stretch w-[249px] relative rounded-md bg-white border-navy border-[1px] border-solid box-border hidden" />
            <input
              className="w-[calc(100%_-_30.3px)] [border:none] [outline:none] bg-[transparent] h-[35px] flex-1 flex flex-col items-start justify-start pt-[18px] px-0 pb-0 box-border font-montserrat font-semibold text-sm text-gray-300 min-w-[90px]"
              placeholder="Get product updates"
              type="text"
            />
            <div className="h-[50px] w-[50px] relative bg-jaffa z-[1]">
              <img
                className="absolute top-[0px] left-[0px] w-full h-full hidden"
                alt=""
                src="/fill.svg"
              />
              <img
                className="absolute top-[19px] left-[18px] w-[15.3px] h-[13px] object-contain z-[2]"
                alt=""
                src="/arrowsdowntopmove1@2x.png"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1073.5px] flex flex-col items-start justify-start gap-[34px] max-w-full text-base mq750:gap-[17px]">
        <div className="self-stretch h-px relative">
          <div className="absolute h-full w-full top-[0%] right-[-0.09%] bottom-[-100%] left-[0%] bg-gray-400 border-white border-[1px] border-solid box-border" />
        </div>
        <div className="self-stretch flex flex-row items-start justify-start py-0 pl-0.5 pr-[3px] box-border max-w-full">
          <div className="flex-1 flex flex-row items-start justify-between max-w-full gap-5 mq1025:flex-wrap">
            <div className="flex flex-row items-start justify-start gap-[15px]">
              <img
                className="h-[35px] w-[35px] relative min-h-[35px]"
                loading="lazy"
                alt=""
                src="/linkedin.svg"
              />
              <img
                className="h-[35px] w-[35px] relative min-h-[35px]"
                loading="lazy"
                alt=""
                src="/facebook.svg"
              />
              <img
                className="h-[35px] w-[35px] relative min-h-[35px]"
                loading="lazy"
                alt=""
                src="/twitter.svg"
              />
            </div>
            <div className="w-64 flex flex-col items-start justify-start pt-[5px] px-0 pb-0 box-border">
              <div className="self-stretch flex flex-row items-start justify-start gap-2">
                <div className="flex flex-col items-start justify-start pt-[5px] px-0 pb-0">
                  <div className="relative font-medium inline-block min-w-[102px]">{`A product of `}</div>
                </div>
                <div className="h-[23px] flex-1 relative">
                  <img
                    className="absolute h-full w-full top-[0%] right-[0.48%] bottom-[0.43%] left-[0%] max-w-full overflow-hidden max-h-full"
                    loading="lazy"
                    alt=""
                    src="/group-42.svg"
                  />
                  <img
                    className="absolute h-[66.09%] w-[41.78%] top-[138.26%] right-[0.14%] bottom-[-104.35%] left-[58.08%] max-w-full overflow-hidden max-h-full object-cover"
                    loading="lazy"
                    alt=""
                    src="/group-43@2x.png"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-start pt-[7.5px] px-0 pb-0 box-border max-w-full">
              <div className="relative font-medium">
                © 2024 Midhun Shankar. All rights reserved
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

Footer2Dark.propTypes = {
  className: PropTypes.string,
};

export default Footer2Dark;
