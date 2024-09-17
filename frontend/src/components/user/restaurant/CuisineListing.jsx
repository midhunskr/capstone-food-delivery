import PropTypes from "prop-types";
import './RestaurantAndCuisine.css'

export const CuisineListing = ({ className = "" }) => {

  //Data
  const SAMPLE_DATA = [
    { image: "/punjabi.png", cuisineName: "Punjabi", hotelName: "Gurji Dhaba" },
    { image: "/chinese.png", cuisineName: "Chinese", hotelName: "Chiyang" },
    { image: "/south-indian.png", cuisineName: "South Indian", hotelName: "Saravana Bhavan" },
    { image: "/sea-food.png", cuisineName: "Seafood", hotelName: "Arabian Palace" },
  ];

  return (
    <>
      <div className={`self-stretch flex flex-col items-center justify-center py-[0rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
        <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
          <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
            <h3 className="m-0 w-[20.75rem] relative text-dark text-inherit leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
              Top Cuisines near by
            </h3>
            <div className="w-[3.688rem] flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
            </div>
          </div>
        </div>
      </div>

      {/* Scroller */}
      <div className="scrollSection2 flex flex-col items-center pb-[3rem]">
        <div
          className="scroll-container w-[69.5rem]"
          style={{
            overflowX: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <div className="flex flex-row gap-[2.818rem] shrink-0 max-w-full text-[1.413rem] text-white">
            {SAMPLE_DATA.map((item, index) => (
              <div key={index} className="w-[15.2rem] shrink-0 flex flex-col items-start justify-start gap-[1.062rem]">
                <div className="cuisineCard shadow-md rounded-[1.5rem] relative overflow-hidden w-[15rem] h-[11rem]" style={{ border: "8px solid white", backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <b className="w-[10rem] top-[7rem] left-[1rem] relative inline-block z-[2] mq450:text-[1.125rem]">
                    {item.cuisineName}
                  </b>
                </div>
                <div className="flex flex-col items-start justify-start gap-[0.75rem]"/>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

CuisineListing.propTypes = {
  className: PropTypes.string,
};