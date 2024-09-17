import PropTypes from "prop-types";

export const HeroSection = ({ className = "" }) => {
  return (
    <div>
        <div
        className={`w-full relative bg-bg-white flex flex-col items-start justify-start pt-0 px-0 pb-[41.3px] box-border gap-[60px] leading-[normal] tracking-[normal] text-center text-base text-black font-arial-rounded-mt-bold mq750:gap-[30px] ${className}`}
        >
        <section className="self-stretch flex flex-row items-start justify-center py-0 px-5 box-border max-w-full text-left text-51xl text-dark font-arial-rounded-mt-bold">
            <div className="w-[1112px] flex flex-row items-start justify-start relative max-w-full">
            <img
                className="h-[184px] w-[184px] absolute !m-[0] top-[72px] left-[-77px]"
                loading="lazy"
                alt=""
                src="/frame-53.svg"
            />
            <div className="h-[694px] flex-1 overflow-hidden flex flex-row items-center justify-start flex-wrap content-center py-11 px-0 box-border relative gap-x-0 gap-y-40 max-w-full z-[1] mq450:h-auto mq450:min-h-[694]">
                <div className="w-[418px] !m-[0] absolute top-[121px] left-[0px] flex flex-col items-start justify-start pt-0 px-0 pb-[132px] box-border gap-[57.3px] max-w-full mq450:h-auto">
                <h1 className="m-0 relative text-inherit font-normal font-[inherit] shrink-0 mq450:text-23xl mq1050:text-37xl">
                    <p className="m-0">Fastest</p>
                    <p className="m-0 text-jaffa">
                    <span>Delivery</span>
                    <span className="text-black">{` `}</span>
                    <span>{`&`}</span>
                    </p>
                    <p className="m-0">
                    <span>Easy</span>
                    <span className="text-black">{` `}</span>
                    <span className="text-jaffa">Pickup</span>
                    </p>
                </h1>
                <div className="w-[433px] overflow-hidden flex flex-row items-start justify-start py-0 px-px box-border gap-[22px] shrink-0 max-w-[104%] text-2xl text-black font-quicksand mq450:flex-wrap">
                    <div className="h-[75px] w-[75px] relative rounded-[50%] bg-gainsboro" />
                    <div className="flex flex-col items-start justify-start pt-1 px-0 pb-0">
                    <h2 className="m-0 h-[67px] relative text-inherit leading-[124.94%] font-semibold font-[inherit] inline-block shrink-0 mq450:text-mid mq450:leading-[21px]">
                        <p className="[margin-block-start:0] [margin-block-end:9px]">
                        When you are too lazy to cook,
                        </p>
                        <p className="m-0">we are just a click away!</p>
                    </h2>
                    </div>
                </div>
                <div className="w-[399px] hidden max-w-full" />
                </div>
                <img
                className="h-[529px] w-[529px] absolute !m-[0] top-[44px] left-[578px] object-contain"
                loading="lazy"
                alt=""
                src="/hero-image@2x.png"
                />
                <div className="w-[528.5px] !m-[0] absolute top-[573px] left-[0px] flex flex-row items-start justify-start gap-[16.5px] max-w-full text-2xl text-black font-quicksand mq450:flex-wrap">
                <div className="flex-1 flex flex-row items-end justify-start relative gap-[41px] min-w-[248px] max-w-full z-[3]">
                    <button className="cursor-pointer [border:none] py-[15.5px] px-[27px] bg-tradewind w-[264px] rounded-51xl flex flex-row items-start justify-start box-border whitespace-nowrap hover:bg-teal">
                    <div className="flex-1 relative text-18xl font-arial-rounded-mt-bold text-white text-center">
                        Get Started
                    </div>
                    </button>
                    <div className="w-[77px] !m-[0] absolute top-[0px] left-[305px] flex flex-row items-start justify-start">
                    <div className="h-[77px] flex-1 relative">
                        <div className="absolute top-[0px] left-[77px] rounded-[50%] bg-jaffa w-full h-full [transform:_rotate(90deg)] [transform-origin:0_0]" />
                        <div className="absolute w-[calc(100%_-_14px)] top-[7px] right-[7px] left-[7px] h-[63px]">
                        <div className="absolute top-[0px] left-[0px] shadow-[0px_0px_34.1px_-17px_rgba(0,_0,_0,_0.42)] rounded-[50%] bg-white w-full h-full z-[1]" />
                        <img
                            className="absolute top-[16.3px] left-[27.5px] rounded-sm w-5 h-[29px] z-[2]"
                            loading="lazy"
                            alt=""
                            src="/vector-3.svg"
                        />
                        </div>
                    </div>
                    </div>
                </div>
                <div className="flex flex-col items-start justify-start pt-[25.3px] px-0 pb-0">
                    <h2 className="m-0 relative text-inherit font-bold font-[inherit] mq450:text-mid">
                    Start a tour!
                    </h2>
                </div>
                </div>
            </div>
            </div>
        </section>
        <div className="self-stretch flex flex-row items-start justify-center py-0 px-5 box-border max-w-full">
            <div className="w-[1101px] flex flex-row items-start justify-between gap-5 max-w-full mq750:flex-wrap mq750:justify-center">
            <div className="w-[178px] flex flex-row items-end justify-start gap-[15px]">
                <div className="h-[55px] flex flex-col items-start justify-end pt-0 px-0 pb-0.5 box-border">
                <img
                    className="w-[53px] h-[53px] relative"
                    loading="lazy"
                    alt=""
                    src="/group-46.svg"
                />
                </div>
                <div className="flex-1 flex flex-col items-start justify-start gap-2">
                <div className="w-[103px] relative inline-block">
                    Fast Delivery
                </div>
                <div className="self-stretch flex flex-row items-start justify-start py-0 pl-px pr-0 text-left text-xs font-quicksand">
                    <div className="flex-1 relative font-semibold">
                    Promised delivery of 30 minutes!
                    </div>
                </div>
                </div>
            </div>
            <div className="w-[178px] flex flex-row items-end justify-start gap-[15px]">
                <div className="w-[53px] flex flex-col items-start justify-end pt-0 px-0 pb-0.5 box-border">
                <div className="self-stretch h-[53px] relative">
                    <img
                    className="absolute top-[0px] left-[0px] w-full h-full"
                    alt=""
                    src="/group-46-1.svg"
                    />
                    <img
                    className="absolute top-[15px] left-[10px] w-[33.3px] h-6 object-contain z-[1]"
                    loading="lazy"
                    alt=""
                    src="/group-49@2x.png"
                    />
                </div>
                </div>
                <div className="flex-1 flex flex-col items-start justify-start gap-2">
                <div className="w-[107px] relative inline-block">
                    Live Tracking
                </div>
                <div className="self-stretch flex flex-row items-start justify-start py-0 pl-px pr-0 text-left text-xs font-quicksand">
                    <div className="flex-1 relative font-semibold">
                    Real-time tracking with map!
                    </div>
                </div>
                </div>
            </div>
            <div className="w-[253px] flex flex-row items-end justify-start gap-[15px]">
                <div className="w-[53px] flex flex-col items-start justify-end pt-0 px-0 pb-0.5 box-border">
                <div className="self-stretch h-[53px] relative">
                    <img
                    className="absolute top-[0px] left-[0px] w-full h-full"
                    alt=""
                    src="/group-46-1.svg"
                    />
                    <img
                    className="absolute top-[8px] left-[11px] w-[31.6px] h-[38.5px] object-contain z-[1]"
                    loading="lazy"
                    alt=""
                    src="/group-50@2x.png"
                    />
                </div>
                </div>
                <div className="flex-1 flex flex-col items-start justify-start gap-2">
                <div className="w-[169px] relative inline-block">
                    AI Recommendations
                </div>
                <div className="self-stretch flex flex-row items-start justify-start py-0 pl-px pr-0 text-left text-xs font-quicksand">
                    <div className="flex-1 relative font-semibold">
                    An intelligent recommendation engine for hussle free
                    selection!
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  )
}

HeroSection.propTypes = {
    className: PropTypes.string,
  };