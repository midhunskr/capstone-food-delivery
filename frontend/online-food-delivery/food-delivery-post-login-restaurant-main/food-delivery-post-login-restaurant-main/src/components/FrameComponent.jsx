import { useMemo } from "react";
import PropTypes from "prop-types";

const FrameComponent = ({
  className = "",
  propWidth,
  propWidth1,
  margherita,
  propPadding,
  prop,
  propMinWidth,
  clipPathGroup,
  propAlignSelf,
  propPadding1,
  pizzaToppedWithOurHerbInfused,
  propFlex,
  propWidth2,
}) => {
  const frameDivStyle = useMemo(() => {
    return {
      width: propWidth,
    };
  }, [propWidth]);

  const frameDiv1Style = useMemo(() => {
    return {
      width: propWidth1,
    };
  }, [propWidth1]);

  const margheritaPriceStyle = useMemo(() => {
    return {
      padding: propPadding,
    };
  }, [propPadding]);

  const divStyle = useMemo(() => {
    return {
      minWidth: propMinWidth,
    };
  }, [propMinWidth]);

  const frameDiv2Style = useMemo(() => {
    return {
      alignSelf: propAlignSelf,
      padding: propPadding1,
    };
  }, [propAlignSelf, propPadding1]);

  const pizzaToppedWithStyle = useMemo(() => {
    return {
      flex: propFlex,
      width: propWidth2,
    };
  }, [propFlex, propWidth2]);

  return (
    <div
      className={`w-[723px] flex flex-col items-start justify-center gap-[22px] max-w-full text-left text-5xl text-dark font-montserrat ${className}`}
      style={frameDivStyle}
    >
      <div
        className="w-[329.4px] flex flex-col items-start justify-start gap-[9px] max-w-full"
        style={frameDiv1Style}
      >
        <div className="flex flex-row items-center justify-start gap-3">
          <div className="h-5 w-[21px] relative">
            <div className="absolute top-[0px] left-[0px] rounded bg-bg-white border-tradewind border-[2px] border-solid box-border w-full h-full" />
            <div className="absolute top-[calc(50%_-_5.1px)] left-[calc(50%_-_5.6px)] rounded-[50%] bg-tradewind w-[10.5px] h-[10.5px] z-[1]" />
          </div>
          <b className="relative leading-[121.88%] mq450:text-lgi mq450:leading-[23px]">
            {margherita}
          </b>
        </div>
        <div
          className="self-stretch flex flex-row items-start justify-start py-0 px-0 gap-[7px] text-lgi-4"
          style={margheritaPriceStyle}
        >
          <div
            className="relative leading-[121.88%] font-semibold inline-block min-w-[49.1px] whitespace-nowrap"
            style={divStyle}
          >
            {prop}
          </div>
          <img
            className="h-[19.5px] w-[19.4px] relative"
            loading="lazy"
            alt=""
            src={clipPathGroup}
          />
          <b className="flex-1 relative leading-[24px] text-label-tint text-center">
            50% OFF USE FIRSTBITE
          </b>
        </div>
        <div className="w-[84px] flex flex-row items-center justify-start py-0 px-0 box-border text-center text-mid-5">
          <img
            className="h-[13.8px] w-[15px] relative"
            loading="lazy"
            alt=""
            src="/vector.svg"
          />
          <div className="flex-1 relative leading-[121.88%] font-semibold shrink-0">
            4.2 (12)
          </div>
        </div>
      </div>
      <div
        className="self-stretch flex flex-row items-center justify-center max-w-full text-lgi text-label-tint"
        style={frameDiv2Style}
      >
        <div
          className="flex-1 relative leading-[121.88%] font-medium inline-block max-w-full"
          style={pizzaToppedWithStyle}
        >
          {pizzaToppedWithOurHerbInfused}
        </div>
      </div>
    </div>
  );
};

FrameComponent.propTypes = {
  className: PropTypes.string,
  margherita: PropTypes.string,
  prop: PropTypes.string,
  clipPathGroup: PropTypes.string,
  pizzaToppedWithOurHerbInfused: PropTypes.string,

  /** Style props */
  propWidth: PropTypes.any,
  propWidth1: PropTypes.any,
  propPadding: PropTypes.any,
  propMinWidth: PropTypes.any,
  propAlignSelf: PropTypes.any,
  propPadding1: PropTypes.any,
  propFlex: PropTypes.any,
  propWidth2: PropTypes.any,
};

export default FrameComponent;
