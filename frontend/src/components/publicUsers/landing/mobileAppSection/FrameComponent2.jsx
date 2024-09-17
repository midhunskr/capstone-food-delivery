import PropTypes from "prop-types";

export const FrameComponent2 = ({ className = "" }) => {
  return (
    <div
      className={`w-[75.5rem] h-[23.25rem] absolute !m-[0] top-[2.875rem] right-[9.719rem] ${className}`}
    >
      <img
        className="absolute top-[1.938rem] left-[0rem] w-[70.5rem] h-[19.669rem] object-cover"
        alt=""
        src="/frame-3596@2x.png"
      />
      <img
        className="absolute top-[16.25rem] left-[23.25rem] rounded-[50%] w-[3.313rem] h-[3.313rem] object-cover z-[1]"
        loading="lazy"
        alt=""
        src="/ellipse-15@2x.png"
      />
      <img
        className="absolute top-[16.25rem] left-[27.438rem] rounded-[50%] w-[3.313rem] h-[3.313rem] object-cover z-[1]"
        loading="lazy"
        alt=""
        src="/ellipse-16@2x.png"
      />
      <img
        className="absolute top-[16.25rem] left-[31.625rem] rounded-[50%] w-[3.313rem] h-[3.313rem] object-cover z-[1]"
        loading="lazy"
        alt=""
        src="/ellipse-17@2x.png"
      />
      <img
        className="absolute top-[16.25rem] left-[35.813rem] rounded-[50%] w-[3.313rem] h-[3.313rem] object-cover z-[1]"
        loading="lazy"
        alt=""
        src="/ellipse-18@2x.png"
      />
      <img
        className="absolute top-[16.25rem] left-[40rem] w-[3.313rem] h-[3.313rem] z-[1]"
        loading="lazy"
        alt=""
        src="/group-56.svg"
      />
      <img
        className="absolute h-full top-[0rem] bottom-[0rem] left-[6.219rem] max-h-full w-[11.438rem] object-cover z-[1]"
        loading="lazy"
        alt=""
        src="/free-iphone-13-pro-mockup-4-1@2x.png"
      />
    </div>
  );
};

FrameComponent2.propTypes = {
  className: PropTypes.string,
};