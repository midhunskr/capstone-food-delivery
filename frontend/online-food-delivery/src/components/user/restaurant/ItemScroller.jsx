import PropTypes from "prop-types"
import './RestaurantAndCuisine.css'
import { useEffect, useRef, useState } from "react"

export const ItemScroller = ({ className = "" }) => {

  //Data
  const SAMPLE_DATA = [
    { image: "/biriyani-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹70", itemName: "Biriyani" },
    { image: "/noodles-1@2x.png", discountPercentage: "15% OFF", upToAmount: "Up to ₹90", itemName: "Noodles" },
    { image: "/burgers-1@2x.png", discountPercentage: "35% OFF", upToAmount: "Up to ₹120", itemName: "Burgers" },
    { image: "/pizza-5@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Pizzas" },
    { image: "/rolls-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Rolls" },
    { image: "/parotta-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Parotta" },
    { image: "/parotta-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Parotta" },
    { image: "/parotta-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Parotta" },
    { image: "/parotta-1@2x.png", discountPercentage: "10% OFF", upToAmount: "Up to ₹40", itemName: "Parotta" }
  ];

  const [scrollPosition, setScrollPosition] = useState(0)
  const [buttonColor, setButtonColor] = useState({ left: '#CACACA', right: '#CACACA' })

  const containerRef = useRef();

  const handleScroll = (scrollAmount) => {
    const container = containerRef.current;

    // Calculate new scroll position with boundary checks
    const newScrollPosition = Math.max(
      0,
      Math.min(
        scrollPosition + scrollAmount,
        container.scrollWidth - container.clientWidth
      )
    );

    // Update state and apply new scroll position
    setScrollPosition(newScrollPosition);
    container.scrollLeft = newScrollPosition;
  };

  useEffect(() => {
    const container = containerRef.current;

    // Check if the scroll position is at the left or right limit
    const atLeftLimit = container.scrollLeft === 0;
    const atRightLimit = container.scrollLeft === container.scrollWidth - container.clientWidth;

    setButtonColor({
      left: atLeftLimit ? '#E0E0E0' : '#CACACA',
      right: atRightLimit ? '#E0E0E0' : '#CACACA',
    });
  }, [scrollPosition]);

  return (
    <>
      <div className={`self-stretch flex flex-col items-center justify-center py-[3rem] px-[1.25rem] pb-[0rem] box-border max-w-full text-left text-[1.5rem] font-montserrat ${className}`}>
        <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full mq450:h-auto mq750:gap-[1rem] mq750:pb-[11.688rem] mq750:box-border">
          <div className="self-stretch flex flex-row items-start justify-between py-[0rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem] mq450:flex-wrap">
            <h3 className="m-0 w-[22.75rem] relative text-inherit text-dark leading-[121.88%] font-bold font-[inherit] inline-block shrink-0 max-w-full mq450:text-[1.188rem] mq450:leading-[1.438rem]">
              Hello, what's on your mind?
            </h3>
            <div className="w-[3.688rem] flex flex-col items-start justify-start pt-[0.062rem] px-[0rem] pb-[0rem]">
              <div className="leftAndRightNavigationButtons self-stretch h-[1.625rem] relative">
                <button onClick={() => handleScroll(-300)} className="cursor-pointer buttonLeft absolute top-[0rem] left-[0rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.left }}>
                  <img src="/arrow-left.svg" alt="" />
                </button>
                <button onClick={() => handleScroll(300)} className="cursor-pointer buttonRight absolute top-[0rem] left-[2.063rem] w-[1.625rem] h-[1.625rem] rounded-xl" style={{ backgroundColor: buttonColor.right }}>
                <img src="/arrow-right.svg" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroller */}
      <div className="scrollSection2 flex flex-col items-center py-[2rem]">
        <div
          ref={containerRef}
          className="scroll-container w-[69.5rem]"
          style={{
            // width: "900px",
            overflowX: "scroll",
            scrollBehavior: "smooth",
          }}
        >
          <div className="flex flex-row justify-start gap-[2.7rem] max-w-full text-[1.413rem] text-white">
          {SAMPLE_DATA.map((item, index) => (
            <div key={index} className="w-[10rem] flex flex-col">
              <div className="itemCard overflow-hidden w-[8rem] h-[6rem]" style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}/>
              <div className="hotelLabel bottom-0 w-full text-center py-[.5rem]">
                <b className="font-normal text-item-tint text-lg">
                  {item.itemName}
                </b>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>

    </>
  );
};

ItemScroller.propTypes = {
  className: PropTypes.string,
};