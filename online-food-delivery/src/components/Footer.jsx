import React from 'react'

export const Footer = ({ className = "" }) => {
  return (
    <div>

<div
      className={`w-[1440px] [background:linear-gradient(#2b2b2b,_#2b2b2b),_#fff] max-w-full overflow-hidden flex flex-col items-center justify-start pt-[78px] pb-[123px] pl-5 pr-[21px] box-border gap-[88px] leading-[normal] tracking-[normal] text-left text-base text-white font-arial-rounded-mt-bold mq750:gap-[22px] mq1125:gap-11 ${className}`}
    >
      <section className="w-[1074px] flex flex-row items-start justify-between gap-5 max-w-full text-left text-lg text-white font-quicksand mq1025:flex-wrap">
        <div className="flex flex-col items-start justify-start py-0 pl-0 pr-[5px] gap-2.5 text-[20px]">
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
        <div className="flex flex-col items-start justify-start gap-[43px] font-arial-rounded-mt-bold">
          <div className="flex flex-col items-start justify-start gap-[25px]">
            <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[106px]">
              Quick Links
            </a>
            <a className="[text-decoration:none] relative text-base font-semibold font-quicksand text-gray-100 inline-block min-w-[60px]">
              Product
            </a>
          </div>
          <div className="relative text-base font-semibold font-quicksand text-gray-100 inline-block min-w-[91px]">
            Information
          </div>
        </div>
        <div className="w-[149px] flex flex-col items-start justify-start pt-[53px] px-0 pb-0 box-border text-base text-gray-100">
          <div className="flex flex-col items-start justify-start gap-[43px]">
            <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[74px]">
              Company
            </a>
            <div className="relative font-semibold inline-block min-w-[76px]">
              Lift Media
            </div>
          </div>
        </div>
        <div className="w-[248px] flex flex-col items-start justify-start gap-[25px] font-arial-rounded-mt-bold">
          <a className="[text-decoration:none] relative leading-[28px] text-[inherit] inline-block min-w-[90px]">
            Subscribe
          </a>
          <div className="self-stretch rounded-md bg-white border-navy border-[1px] border-solid flex flex-row items-start justify-between py-0 pl-[15px] pr-px gap-5">
            <div className="self-stretch w-[249px] relative rounded-md bg-white border-navy border-[1px] border-solid box-border hidden" />
            <input
              className="w-[139px] [border:none] [outline:none] bg-[transparent] h-9 flex flex-col items-start justify-start pt-[18px] px-0 pb-0 box-border font-quicksand font-semibold text-[14px] text-gray-200"
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
      </section>
      <div className="w-[1073.5px] flex flex-col items-start justify-start gap-[34px] max-w-full mq750:gap-[17px]">
        <div className="self-stretch h-px relative">
          <div className="absolute h-full w-full top-[0%] right-[-0.09%] bottom-[-100%] left-[0%] bg-gray-300 border-white border-[1px] border-solid box-border" />
        </div>
        <div className="self-stretch flex flex-row items-start justify-between gap-5 mq1025:flex-wrap">
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
          <div className="w-64 flex flex-col items-start justify-start pt-[11px] px-0 pb-0 box-border">
            <div className="self-stretch flex flex-row items-start justify-start gap-[13px]">
              <div className="flex flex-col items-start justify-start pt-[5px] px-0 pb-0">
                <div className="relative inline-block min-w-[97px]">{`A product of `}</div>
              </div>
              <div className="h-[23px] flex-1 relative">
                <img
                  className="absolute h-full w-full top-[0%] right-[0.48%] bottom-[0.43%] left-[0%] max-w-full overflow-hidden max-h-full"
                  loading="lazy"
                  alt=""
                  src="/group-42-1.svg"
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
          <div className="flex flex-col items-start justify-start pt-[15px] px-0 pb-0 font-quicksand">
            <div className="relative font-semibold">
              © 2020 Lift Media. All rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}
