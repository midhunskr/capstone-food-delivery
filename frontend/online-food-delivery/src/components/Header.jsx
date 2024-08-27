import React from 'react'

export const Header = ({ className = "" }) => {
  return (
    <div>
        <div
      className={`w-full sticky shadow-[0px_4px_45.6px_-19px_rgba(0,_0,_0,_0.25)] bg-bg-white overflow-hidden flex flex-row items-start justify-between pt-[31.9px] px-[164px] pb-[31.8px] box-border top-[0] z-[99] leading-[normal] tracking-[normal] gap-5 text-center text-5xs text-white font-montserrat mq360:pl-5 mq360:pr-5 mq360:box-border mq720:pl-[82px] mq720:pr-[82px] mq720:box-border ${className}`}
    >
      <div className="w-[145.8px] flex flex-col items-end justify-start gap-[8.9px]">
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
          <a className="[text-decoration:none] flex-1 relative font-bold text-[inherit] inline-block min-w-[51px] z-[1]">
            ESTD. 2003
          </a>
        </div>
      </div>
      <div className="w-[373.6px] flex flex-col items-start justify-start pt-[12.8px] px-0 pb-0 box-border max-w-full text-left text-base-5 text-dark">
        <div className="flex flex-row items-start justify-start gap-[29.5px]">
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
          <div className="flex flex-row items-start justify-start py-0 pl-0 pr-3.5 gap-[15px]">
            <div className="flex flex-col items-start justify-start pt-[3.8px] px-0 pb-0">
              <img
                className="w-[13.8px] h-[13.8px] relative"
                loading="lazy"
                alt=""
                src="/frame-41.svg"
              />
            </div>
            <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[53.2px]">
              Offers
            </a>
          </div>
          <div className="flex flex-row items-start justify-start gap-[12.2px]">
            <div className="flex flex-col items-start justify-start pt-[3.6px] px-0 pb-0">
              <img
                className="w-[13.8px] h-[13.8px] relative shrink-0"
                loading="lazy"
                alt=""
                src="/group-40.svg"
              />
            </div>
            <a className="[text-decoration:none] relative font-semibold text-[inherit] shrink-0">
              <p className="m-0">Help</p>
            </a>
          </div>
        </div>
      </div>
      <div className="w-[126px] flex flex-col items-start justify-start pt-[1.5px] px-0 pb-0 box-border">
        <button className="cursor-pointer [border:none] pt-[7.6px] pb-[7.7px] pl-[13px] pr-3 bg-tradewind self-stretch rounded-17xl flex flex-row items-start justify-start gap-[18px]">
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
  )
}
