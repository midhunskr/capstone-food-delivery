import PropTypes from "prop-types";
import { useState } from "react";
import { Link } from "react-router-dom";

export const UserHeader = ({ className = "" }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsProfileMenuOpen(true);
  };

  const handleMouseLeave = () => {
    setIsProfileMenuOpen(false);
  };
  return (
    <header
      className={`self-stretch shadow-[0px_4px_45.6px_-19px_rgba(0,_0,_0,_0.25)] bg-bg-white overflow-visible flex flex-row items-start justify-center pt-[1.625rem] px-[1.25rem] pb-[1.5rem] box-border gap-[5.35rem] top-[0] z-[99] sticky max-w-full text-left text-[1.031rem] text-text-dark font-montserrat lg:gap-[2.688rem] mq750:gap-[1.313rem] ${className}`}
    >
      <div className="flex flex-col items-start justify-start pt-[0.118rem] px-[0rem] pb-[0rem]">
        <div className="w-[2.5rem] flex flex-row items-center justify-between gap-[0.267rem]">
        <img
            className="h-[1.331rem] w-[1.038rem] relative min-h-[1.313rem]"
            loading="lazy"
            alt=""
            src="/frame-3789.svg"
          />
          <img
            className="h-[1.331rem] w-[1.038rem] relative min-h-[1.313rem]"
            loading="lazy"
            alt=""
            src="/frame-3790.svg"
          />
        </div>
      </div>
      <div className="w-[16.444rem] flex flex-row items-start justify-start py-[0rem] pl-[0rem] pr-[0.375rem] box-border gap-[1.543rem] text-center">
        <div className="w-[3.313rem] flex flex-col items-end justify-start gap-[0.318rem]">
          <Link to={"/"}><div className="self-stretch relative leading-[121.88%] font-semibold inline-block min-w-[3.313rem] text-dark">Home</div></Link>
          <div className="self-stretch h-[0.125rem] relative border-dark border-t-[2px] border-solid box-border" />
        </div>
        <div className="flex-1 flex flex-col items-start justify-start pt-[0.218rem] px-[0rem] pb-[0rem] text-left text-[0.875rem] text-gray-100 font-quicksand">
          <div className="self-stretch h-[1.125rem] relative">
            <b className="absolute top-[0rem] left-[0rem] inline-block w-[10.063rem] h-[1.125rem] whitespace-nowrap text-label-tint font-normal">
              123, Street name, City....
            </b>
            <img
              className="absolute top-[0.35rem] left-[10.519rem] w-[0.688rem] h-[0.438rem]"
              alt=""
              src="/frame-3804.svg"
            />
          </div>
        </div>
      </div>
      <div className="overflow-hidden flex flex-row items-start justify-start pt-[0.006rem] px-[0rem] pb-[0.012rem] box-border gap-[1.681rem] max-w-full text-[1.2rem]">
        <div className="flex flex-row items-start justify-start gap-[1.087rem]">
          <div className="flex flex-col items-start justify-start pt-[0.325rem] px-[0rem] pb-[0rem]">
            <img
              className="w-[0.9rem] h-[0.9rem] relative"
              alt=""
              src="/frame-3796.svg"
            />
          </div>
          <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[4.294rem] text-dark">
            Search
          </a>
        </div>
        <div className="flex flex-row items-start justify-start py-[0rem] pl-[0rem] pr-[1rem] gap-[1.087rem]">
          <div className="flex flex-col items-start justify-start pt-[0.275rem] px-[0rem] pb-[0rem]">
            <img
              className="w-[1rem] h-[1rem] relative shrink-0"
              alt=""
              src="/frame-41.svg"
            />
          </div>
          <a className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[3.863rem] shrink-0 text-dark">
            Offers
          </a>
        </div>
        <div className="flex flex-row items-start justify-start gap-[1.093rem]">
          <div className="flex flex-col items-start justify-start pt-[0.275rem] px-[0rem] pb-[0rem]">
            <img
              className="w-[1rem] h-[1rem] relative"
              alt=""
              src="/frame-3791.svg"
            />
          </div>
          <Link to={'/help'} className="[text-decoration:none] relative font-semibold text-[inherit] text-dark">
              Help
          </Link>
        </div>
      </div>
      {/* Profile Section with Dropdown */}
      <div className="relative flex flex-row items-start justify-start gap-[2.218rem] text-[1.225rem]">
        <div
          className="relative flex flex-row items-start justify-start gap-[1.187rem] shrink-0"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex flex-col items-start justify-start pt-[0.268rem] px-[0rem] pb-[0rem]">
            <img
              className="w-[1.019rem] h-[1.019rem] relative shrink-0"
              alt=""
              src="/clip-path-group.svg"
            />
          </div>
          <Link
            to="profile"
            className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[4.438rem] shrink-0 whitespace-nowrap text-dark"
          >
            Profile
          </Link>
          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <div
              className="absolute top-[3.5rem] left-0 bg-white shadow-md rounded-lg p-3 w-[10rem] z-[9999] text-[0.9rem] transition-opacity duration-300"
              style={{ zIndex: 9999 }}
              onMouseEnter={handleMouseEnter} // Keep the dropdown open on hover
              onMouseLeave={handleMouseLeave} // Close the dropdown when cursor leaves
            >
              <Link
                to={"/profile"}
                className="block mb-2 hover:bg-gray-100 p-2 rounded"
              >
                View Profile
              </Link>
              <Link
                to={"/settings"}
                className="block mb-2 hover:bg-gray-100 p-2 rounded"
              >
                Settings
              </Link>
              <button className="text-left w-full text-red-600 hover:bg-gray-100 p-2 rounded">
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-row items-start justify-start gap-[1.187rem] shrink-0">
          <div className="flex flex-col items-start justify-start pt-[0.268rem] px-[0rem] pb-[0rem]">
            <img
              className="w-[1.019rem] h-[1.019rem] relative object-cover"
              alt=""
              src="/frame-3798@2x.png"
            />
          </div>
          <a
            className="[text-decoration:none] relative font-semibold text-[inherit] inline-block min-w-[2.813rem] whitespace-nowrap text-dark"
          >
            Cart
          </a>
        </div>
      </div>
    </header>
  );
};

UserHeader.propTypes = {
  className: PropTypes.string,
};