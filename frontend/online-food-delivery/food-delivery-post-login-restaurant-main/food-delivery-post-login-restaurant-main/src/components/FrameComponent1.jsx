import { useMemo } from "react";
import PropTypes from "prop-types";

const FrameComponent1 = ({
  className = "",
  menuItemBackground,
  propRight,
  propBottom,
}) => {
  const addButtonStyle = useMemo(() => {
    return {
      right: propRight,
      bottom: propBottom,
    };
  }, [propRight, propBottom]);

  return (
    <div
      className={`h-[218.5px] flex flex-col items-start justify-start pt-[8.5px] px-0 pb-0 box-border text-center text-5xl text-tradewind font-montserrat ${className}`}
    >
      <div className="flex-1 flex flex-row items-start justify-start relative">
        <img
          className="h-[210px] w-[210px] relative rounded-[26.25px] object-cover"
          loading="lazy"
          alt=""
          src={menuItemBackground}
        />
        <div
          className="h-[51px] w-[135px] absolute !m-[0] right-[32px] bottom-[-24.7px] z-[1]"
          style={addButtonStyle}
        >
          <div className="absolute top-[0px] left-[0px] shadow-[0px_11px_18px_-11px_rgba(0,_0,_0,_0.3)] rounded-xl bg-bg-white border-white border-[5px] border-solid box-border w-full h-full" />
          <b className="absolute top-[calc(50%_-_15.5px)] left-[calc(50%_-_28.5px)] leading-[31px] inline-block w-14 h-[31px] min-w-[56px] z-[1] mq450:text-lgi mq450:leading-[23px]">
            Add
          </b>
        </div>
      </div>
    </div>
  );
};

FrameComponent1.propTypes = {
  className: PropTypes.string,
  menuItemBackground: PropTypes.string,

  /** Style props */
  propRight: PropTypes.any,
  propBottom: PropTypes.any,
};

export default FrameComponent1;
