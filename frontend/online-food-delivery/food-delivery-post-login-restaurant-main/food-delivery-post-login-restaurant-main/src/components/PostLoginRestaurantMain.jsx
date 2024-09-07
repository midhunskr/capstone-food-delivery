import PropTypes from "prop-types";

const PostLoginRestaurantMain = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch bg-bg-white overflow-hidden flex flex-col items-center justify-start pt-6 px-5 pb-[54px] box-border gap-[34px] max-w-full text-left text-5xl text-dark font-montserrat mq750:gap-[17px] mq750:pb-[23px] mq750:box-border mq1025:pt-5 mq1025:pb-[35px] mq1025:box-border ${className}`}
    >
      <div className="w-[1128px] overflow-hidden flex flex-col items-start justify-start pt-0 px-[26px] pb-[53.2px] box-border relative gap-[77px] max-w-full text-center mq450:gap-[38px] mq450:pb-[35px] mq450:box-border">
        <b className="relative leading-[121.88%] inline-block min-w-[119px] mq450:text-lgi mq450:leading-[23px]">
          Pizza Hut
        </b>
        <div className="w-full h-[306px] absolute !m-[0] right-[0px] bottom-[0px] left-[0px]">
          <div className="absolute top-[0px] left-[0px] rounded-25xl [background:linear-gradient(180deg,_rgba(167,_208,_139,_0.5),_rgba(104,_177,_159,_0.7))] w-full h-full" />
          <img
            className="absolute top-[26px] left-[29px] rounded-14xl w-[1072px] h-64 z-[1]"
            alt=""
            src="/rectangle-25.svg"
          />
        </div>
        <div className="w-[379px] flex flex-row items-start justify-start py-0 px-[27px] box-border max-w-full text-sm">
          <div className="flex-1 flex flex-col items-start justify-start gap-6 max-w-full">
            <div className="flex flex-col items-start justify-start gap-3.5 z-[2] text-lgi">
              <div className="flex flex-row items-start justify-start gap-2">
                <div className="h-[37px] flex flex-col items-center justify-center p-2 box-border relative gap-2">
                  <img
                    className="w-full h-full absolute !m-[0] top-[0px] left-[0px]"
                    alt=""
                    src="/star-one.svg"
                  />
                  <img
                    className="w-[20.9px] h-5 relative z-[1]"
                    loading="lazy"
                    alt=""
                    src="/frame-3698.svg"
                  />
                </div>
                <div className="flex flex-col items-start justify-start pt-[7px] px-0 pb-0">
                  <div className="relative leading-[121.88%] font-semibold">
                    4.2 (940 ratings)
                  </div>
                </div>
              </div>
              <b className="relative leading-[121.88%] inline-block text-jaffa min-w-[63px]">
                Pizzas
              </b>
            </div>
            <div className="w-[161px] flex flex-row items-start justify-start gap-[5px] z-[2]">
              <div className="h-[55.5px] flex flex-col items-start justify-start pt-[4.5px] px-0 pb-0 box-border">
                <img
                  className="w-1.5 flex-1 relative max-h-full"
                  loading="lazy"
                  alt=""
                  src="/frame-3725.svg"
                />
              </div>
              <div className="flex-1 flex flex-col items-start justify-start gap-[29px]">
                <div className="self-stretch flex flex-row items-start justify-start gap-[5px]">
                  <div className="relative leading-[14px] font-semibold inline-block min-w-[46px]">
                    Outlet
                  </div>
                  <div className="flex-1 relative leading-[12px] font-medium text-label-tint inline-block min-w-[99px]">
                    Perumbavoor
                  </div>
                </div>
                <div className="relative leading-[121.88%] font-semibold inline-block min-w-[79px]">
                  25-30 mins
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start gap-3.5 z-[2] text-label-tint">
              <img
                className="h-[17.8px] w-6 relative"
                loading="lazy"
                alt=""
                src="/frame-3727.svg"
              />
              <div className="h-3 flex-1 relative leading-[121.88%] font-medium inline-block">
                Order above 149 eligible for free delivery
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1128px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
        <div className="flex-1 overflow-hidden flex flex-col items-start justify-start gap-5 max-w-full">
          <div className="self-stretch flex flex-row items-start justify-between py-0 pl-[15px] pr-0 gap-5 mq450:flex-wrap">
            <b className="relative leading-[121.88%] mq450:text-lgi mq450:leading-[23px]">
              Deals for you
            </b>
            <div className="w-[59px] flex flex-col items-start justify-start pt-[1.5px] px-0 pb-0 box-border">
              <div className="self-stretch h-[26px] relative">
                <img
                  className="absolute top-[0px] left-[0px] w-[26px] h-[26px]"
                  loading="lazy"
                  alt=""
                  src="/frame-3787.svg"
                />
                <img
                  className="absolute top-[0px] left-[33px] w-[26px] h-[26px]"
                  loading="lazy"
                  alt=""
                  src="/frame-3784.svg"
                />
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-row items-start justify-between pt-[13px] pb-[12.9px] pl-5 pr-[42px] box-border relative max-w-full gap-5 text-center mq1025:flex-wrap mq1125:pr-[21px] mq1125:box-border">
            <div className="h-full w-[368px] !m-[0] absolute top-[0px] bottom-[0px] left-[0px] flex flex-row items-start justify-start max-w-full">
              <div className="self-stretch flex-1 relative rounded-lg bg-bg-white border-gray-100 border-[2px] border-solid box-border max-w-full" />
            </div>
            <div className="h-14 w-[257px] flex flex-col items-start justify-start pt-px px-0 pb-0 box-border">
              <div className="self-stretch flex-1 flex flex-row items-start justify-start gap-[22px]">
                <img
                  className="self-stretch w-[66px] relative max-h-full object-cover min-h-[55px] z-[1]"
                  loading="lazy"
                  alt=""
                  src="/frame-3665@2x.png"
                />
                <div className="flex-1 flex flex-col items-start justify-start pt-px px-0 pb-0">
                  <div className="self-stretch flex flex-col items-start justify-start gap-px">
                    <b className="relative leading-[30px] z-[1] mq450:text-lgi mq450:leading-[23px]">
                      Items at ₹149
                    </b>
                    <b className="relative text-mid leading-[22px] text-label-tint z-[1]">
                      ON SELECT ITEMS
                    </b>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-full w-[368px] !m-[0] absolute top-[0px] right-[322px] bottom-[0px] flex flex-row items-start justify-start max-w-full">
              <div className="self-stretch flex-1 relative rounded-lg bg-bg-white border-gray-100 border-[2px] border-solid box-border max-w-full" />
            </div>
            <div className="w-[279.5px] flex flex-col items-start justify-start pt-0.5 px-0 pb-0 box-border">
              <div className="w-[213px] flex flex-row items-end justify-start gap-[22px] z-[1]">
                <div className="flex flex-col items-start justify-end pt-0 px-0 pb-[2.4px]">
                  <img
                    className="w-12 h-[48.1px] relative object-cover"
                    loading="lazy"
                    alt=""
                    src="/frame-3735@2x.png"
                  />
                </div>
                <div className="flex-1 flex flex-col items-start justify-start gap-1.5">
                  <b className="h-[25px] relative leading-[121.88%] inline-block shrink-0 min-w-[123px] mq450:text-lgi mq450:leading-[23px]">
                    Up to ₹99
                  </b>
                  <b className="self-stretch relative text-mid leading-[22px] text-label-tint">
                    USE FRAICHE50
                  </b>
                </div>
              </div>
            </div>
            <div className="h-full w-[254px] !m-[0] absolute top-[0px] right-[0px] bottom-[0px] flex flex-row items-start justify-start">
              <div className="self-stretch flex-1 relative rounded-tl-lg rounded-tr-none rounded-br-none rounded-bl-lg bg-bg-white border-gray-100 border-[2px] border-solid" />
            </div>
            <div className="h-[57.1px] flex flex-row items-start justify-start text-3xs">
              <div className="self-stretch flex flex-row items-start justify-start pt-0 pb-[0.1px] pl-0 pr-[19px] relative">
                <img
                  className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-cover z-[1]"
                  alt=""
                  src="/item-six-offer@2x.png"
                />
                <div className="self-stretch w-6 flex flex-row items-start justify-start py-1 px-[7px] box-border relative z-[3]">
                  <img
                    className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full"
                    alt=""
                    src="/item-six-discount-value.svg"
                  />
                  <b className="w-[49px] relative leading-[121.88%] inline-block shrink-0 [transform:_rotate(-90deg)] z-[1]">
                    50% OFF
                  </b>
                </div>
              </div>
              <div className="flex flex-row items-start justify-start pt-[18px] px-7 pb-[17.1px] relative ml-[-21.9px] text-mid text-label-tint">
                <img
                  className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] max-w-full overflow-hidden max-h-full object-cover z-[2]"
                  loading="lazy"
                  alt=""
                  src="/frame-3740@2x.png"
                />
                <b className="relative leading-[22px] inline-block min-w-[91px] z-[3]">
                  FIRSTBITE
                </b>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1128px] flex flex-col items-start justify-start gap-[35px] max-w-full mq750:gap-[17px]">
        <div className="self-stretch h-[29px] overflow-hidden shrink-0 flex flex-row items-start justify-start pt-0 px-[7px] pb-[13.8px] box-border gap-[17.5px] max-w-full">
          <div className="h-[14.7px] flex-1 flex flex-col items-start justify-start pt-[14.2px] px-0 pb-0 box-border max-w-[calc(100%_-_625px)]">
            <img
              className="self-stretch relative max-w-full overflow-hidden max-h-full mt-[-11px]"
              loading="lazy"
              alt=""
              src="/frame-3743.svg"
            />
          </div>
          <div className="relative tracking-[6px] leading-[30px] font-medium inline-block min-w-[102px] mq450:text-lgi mq450:leading-[23px]">
            MENU
          </div>
          <div className="self-stretch flex-1 flex flex-col items-start justify-start pt-[13.7px] px-0 pb-0 box-border max-w-[calc(100%_-_625px)]">
            <img
              className="self-stretch relative max-w-full overflow-hidden max-h-full mt-[-11px]"
              loading="lazy"
              alt=""
              src="/frame-3744.svg"
            />
          </div>
        </div>
        <div className="w-[671.5px] flex flex-row items-start justify-start py-0 px-[39px] box-border max-w-full text-center text-lgi text-label-tint">
          <div className="flex-1 flex flex-row items-start justify-start flex-wrap content-start gap-[59.1px] max-w-full mq750:gap-[30px]">
            <div className="flex flex-col items-start justify-start pt-3 px-0 pb-0">
              <div className="flex flex-row items-start justify-start gap-[13.9px]">
                <div className="flex flex-col items-start justify-start pt-[2.4px] px-0 pb-0">
                  <img
                    className="w-[16.9px] h-[18.1px] relative z-[1]"
                    alt=""
                    src="/search-icon.svg"
                  />
                </div>
                <div className="flex flex-row items-start justify-start relative">
                  <div className="w-[277px] !m-[0] absolute top-[calc(50%_-_23.5px)] left-[-69.9px] flex flex-row items-start justify-start">
                    <div className="h-[47px] flex-1 relative rounded-3xs bg-white border-gray-100 border-[2px] border-solid box-border" />
                  </div>
                  <div className="relative leading-[121.88%] font-semibold z-[1]">
                    Search for dishes
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-row items-start justify-center gap-5 min-w-[218px] max-w-full mq450:flex-wrap">
              <div className="flex flex-row items-start justify-start pt-[13px] px-[23px] pb-[15px] relative">
                <div className="w-full !m-[0] absolute h-full top-[0px] right-[0px] bottom-[0px] left-[0px] flex flex-row items-start justify-start">
                  <div className="h-[47px] flex-1 relative rounded-38xl bg-white border-gray-100 border-[2px] border-solid box-border" />
                </div>
                <div className="h-[19px] w-[42px] relative z-[1]">
                  <div className="absolute top-[4px] left-[13px] rounded-xl bg-gainsboro w-[29px] h-[11px]">
                    <div className="absolute top-[0px] left-[0px] rounded-xl bg-gainsboro w-full h-full hidden" />
                  </div>
                  <div className="absolute top-[0px] left-[0px] w-5 h-[19px] flex flex-row items-center justify-center py-1 px-[5px] box-border gap-2 z-[1]">
                    <div className="h-full w-full absolute !m-[0] top-[0px] left-[0px] z-[0]">
                      <div className="absolute top-[0px] left-[0px] rounded-8xs bg-white border-tradewind border-[2px] border-solid box-border w-full h-full" />
                    </div>
                    <img
                      className="h-2.5 w-2.5 relative z-[1]"
                      alt=""
                      src="/filter-chip-close.svg"
                    />
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col items-start justify-start py-0 pl-0 pr-5 box-border min-w-[71px]">
                <div className="self-stretch flex flex-row items-start justify-start pt-[13px] px-[23px] pb-[15px] relative gap-2">
                  <div className="w-full !m-[0] absolute h-full top-[0px] right-[0px] bottom-[0px] left-[0px] flex flex-row items-start justify-start">
                    <div className="h-[47px] flex-1 relative rounded-38xl bg-white border-gray-100 border-[2px] border-solid box-border" />
                  </div>
                  <div className="h-[19px] w-[42px] relative z-[1]">
                    <div className="absolute top-[4px] left-[13px] rounded-xl bg-gainsboro w-[29px] h-[11px]">
                      <div className="absolute top-[0px] left-[0px] rounded-xl bg-gainsboro w-full h-full hidden" />
                    </div>
                    <div className="absolute top-[0px] left-[0px] w-5 h-[19px] flex flex-row items-start justify-start py-[3.5px] px-1 box-border gap-2 z-[1]">
                      <div className="w-full !m-[0] absolute h-full top-[0px] right-[0px] bottom-[0px] left-[0px] flex flex-col items-start justify-start">
                        <div className="self-stretch h-[19px] relative rounded-8xs bg-white border-jaffa border-[2px] border-solid box-border" />
                      </div>
                      <div className="h-3 w-3 flex flex-row items-center justify-start z-[1]">
                        <img
                          className="h-3 w-3 relative rounded-12xs"
                          alt=""
                          src="/filter-dropdown-icon.svg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-start justify-start pt-3 px-0 pb-0">
                <div className="flex flex-row items-start justify-start relative">
                  <div className="w-[138px] !m-[0] absolute top-[calc(50%_-_23.5px)] left-[calc(50%_-_69px)] flex flex-row items-start justify-start">
                    <div className="h-[47px] flex-1 relative rounded-38xl bg-white border-gray-100 border-[2px] border-solid box-border" />
                  </div>
                  <div className="relative leading-[121.88%] font-semibold inline-block min-w-[97px] z-[1]">
                    Bestseller
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[1128px] flex flex-row items-start justify-start py-0 px-px box-border max-w-full">
        <div className="flex-1 flex flex-col items-start justify-start gap-[38px] max-w-full mq750:gap-[19px]">
          <div className="flex flex-row items-start justify-start py-0 px-[15px]">
            <b className="relative leading-[121.88%] inline-block min-w-[123px] mq450:text-lgi mq450:leading-[23px]">
              Top Picks
            </b>
          </div>
          <div className="self-stretch flex flex-row items-end justify-between pt-[106px] px-[33px] pb-[15px] box-border relative max-w-full gap-5 text-white mq1025:flex-wrap">
            <div className="h-full w-[475px] absolute !m-[0] top-[0px] bottom-[0px] left-[13px] max-w-full">
              <div className="absolute top-[0px] left-[0px] w-full flex flex-col items-start justify-start max-w-full h-full">
                <img
                  className="self-stretch flex-1 relative rounded-7xl max-w-full overflow-hidden max-h-full object-cover"
                  alt=""
                  src="/second-top-pick-background@2x.png"
                />
              </div>
              <div className="absolute top-[0px] left-[0px] w-full h-full flex flex-row items-start justify-start max-w-full z-[1]">
                <div className="h-[203px] flex-1 relative rounded-7xl [background:linear-gradient(179.29deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.5)_53%,_rgba(0,_0,_0,_0.6)_78%,_#000)] border-disabled-grey border-[13px] border-solid box-border max-w-[106%] shrink-0" />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-1 z-[2]">
              <div className="flex flex-row items-start justify-start gap-2.5">
                <div className="flex flex-col items-start justify-start pt-[5.9px] px-0 pb-0">
                  <div className="h-[17.1px] flex flex-row items-center justify-center py-0.5 px-[3px] box-border relative gap-2">
                    <div className="h-full w-full absolute !m-[0] top-[0px] left-[0px] z-[0]">
                      <div className="absolute top-[0px] left-[0px] rounded bg-bg-white border-tradewind border-[2px] border-solid box-border w-full h-full" />
                    </div>
                    <img
                      className="h-3 w-3 relative z-[1]"
                      loading="lazy"
                      alt=""
                      src="/frame-3754.svg"
                    />
                  </div>
                </div>
                <b className="relative leading-[121.88%] mq450:text-lgi mq450:leading-[23px]">
                  Dhabe Da Keema
                </b>
              </div>
              <div className="relative text-lgi leading-[121.88%] font-semibold inline-block min-w-[49px] whitespace-nowrap">
                ₹749
              </div>
            </div>
            <div className="h-[50px] w-[102px] flex flex-col items-start justify-start">
              <div className="w-[50px] flex-1 flex flex-row items-start justify-start z-[2]">
                <div className="self-stretch flex-1 flex flex-row items-start justify-start relative">
                  <div className="self-stretch flex-1 relative rounded-[50%] bg-tradewind" />
                  <div className="!m-[0] absolute bottom-[10px] left-[calc(50%_-_0px)] flex flex-row items-center justify-start z-[1]">
                    <img
                      className="h-7 w-[5px] relative object-contain"
                      loading="lazy"
                      alt=""
                      src="/line-5.svg"
                    />
                  </div>
                  <div className="h-0 !m-[0] absolute top-[calc(50%_-_0px)] left-[calc(50%_-_14px)] flex flex-col items-start justify-start z-[2]">
                    <img
                      className="w-7 h-[5px] relative"
                      alt=""
                      src="/line-6.svg"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="!m-[0] absolute h-full top-[0px] right-[13px] bottom-[0px] flex flex-col items-start justify-start max-w-full">
              <img
                className="self-stretch flex-1 relative rounded-7xl max-w-full overflow-hidden max-h-full object-cover"
                alt=""
                src="/rectangle-32-1@2x.png"
              />
            </div>
            <div className="h-full w-[475px] !m-[0] absolute top-[0px] right-[13px] bottom-[0px] flex flex-row items-start justify-start max-w-full z-[1]">
              <div className="h-[203px] w-[501px] relative rounded-7xl [background:linear-gradient(179.37deg,_rgba(217,_217,_217,_0),_rgba(0,_0,_0,_0.5)_53%,_rgba(0,_0,_0,_0.6)_78%,_#000)] border-disabled-grey border-[13px] border-solid box-border max-w-[106%] shrink-0" />
            </div>
            <div className="w-[435px] flex flex-row items-start justify-start gap-[138px] max-w-full z-[2] mq450:gap-[69px] mq750:flex-wrap">
              <div className="flex flex-col items-start justify-start gap-1">
                <div className="flex flex-row items-start justify-start gap-2.5">
                  <div className="flex flex-col items-start justify-start pt-[5.9px] px-0 pb-0">
                    <div className="h-[17.1px] flex flex-row items-center justify-center py-0.5 px-[3px] box-border relative gap-2">
                      <div className="h-full w-full absolute !m-[0] top-[0px] left-[0px] z-[0]">
                        <div className="absolute top-[0px] left-[0px] rounded bg-bg-white border-jaffa border-[2px] border-solid box-border w-full h-full" />
                      </div>
                      <img
                        className="h-3 w-3 relative z-[1]"
                        loading="lazy"
                        alt=""
                        src="/frame-3754-1.svg"
                      />
                    </div>
                  </div>
                  <b className="relative leading-[121.88%] mq450:text-lgi mq450:leading-[23px]">
                    Dhabe Da Keema
                  </b>
                </div>
                <div className="relative text-lgi leading-[121.88%] font-semibold inline-block min-w-[49px] whitespace-nowrap">
                  ₹749
                </div>
              </div>
              <div className="flex flex-col items-start justify-start pt-[3px] px-0 pb-0">
                <div className="flex flex-row items-start justify-start">
                  <div className="flex flex-row items-start justify-start pt-3 px-[25px] pb-2.5 relative">
                    <div className="h-full w-full absolute !m-[0] top-[0px] right-[0px] bottom-[0px] left-[0px] rounded-[50%] bg-tradewind" />
                    <div className="flex flex-row items-center justify-start z-[1]">
                      <img
                        className="h-7 w-[5px] relative object-contain"
                        loading="lazy"
                        alt=""
                        src="/line-5.svg"
                      />
                    </div>
                    <div className="h-0 !m-[0] absolute top-[calc(50%_-_0px)] left-[calc(50%_-_14px)] flex flex-col items-start justify-start z-[2]">
                      <img
                        className="w-7 h-[5px] relative"
                        alt=""
                        src="/line-6.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

PostLoginRestaurantMain.propTypes = {
  className: PropTypes.string,
};

export default PostLoginRestaurantMain;
