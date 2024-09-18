import PropTypes from "prop-types";

export const FrameComponent4 = () => {
  return (
    <div className="flex bg-bg-white flex-col items-center relative gap-[5rem] text-left text-[1.313rem] text-dark py-[3rem]">
      <div className="flex flex-col text-[2.5rem]">
        <div className="w-[80rem] flex items-center gap-[5rem]">
          <h2 className="m-0 relative text-inherit font-bold">
            <span>Our</span>
            <span className="text-black">{` `}</span>
            <span className="text-jaffa">Best Delivered</span>
            <span className="text-black">{` `}</span>
            <span>Cartegories</span>
          </h2>
          <b className="font-normal text-mid">It is just not bringing your favorite food, we deliver you
            experience.</b>
        </div>
      </div>
      <div className="w-full flex items-center justify-center gap-[13rem]">
        <div className="flex flex-col items-center">
          <img
            className=""
            loading="lazy"
            alt=""
            src="/group-67.svg"
          />
          <div className="pt-[.6rem] flex flex-col items-center">
            <div className="font-bold">
              Masala Chicken
            </div>
            <b className="font-bold text-lg text-jaffa">{`Order Now >`}</b>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            className=""
            loading="lazy"
            alt=""
            src="/group-69.svg"
          />
          <div className="flex flex-col items-center">
            <div className="font-bold">
            French Fires
            </div>
            <b className="font-bold text-lg text-jaffa">{`Order Now >`}</b>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            className=""
            loading="lazy"
            alt=""
            src="/group-68.svg"
          />
          <div className="pt-[1.5rem] flex flex-col items-center">
            <div className="font-bold">
            Soft Drinks
            </div>
            <b className="font-bold text-lg text-jaffa">{`Order Now >`}</b>
          </div>
        </div>

      </div>
    </div>
  );
};

FrameComponent4.propTypes = {
  className: PropTypes.string,
};