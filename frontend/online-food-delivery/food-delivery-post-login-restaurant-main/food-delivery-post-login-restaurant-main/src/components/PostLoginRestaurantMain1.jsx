import FrameComponent from "./FrameComponent";
import FrameComponent1 from "./FrameComponent1";
import PropTypes from "prop-types";

const PostLoginRestaurantMain1 = ({ className = "" }) => {
  return (
    <section
      className={`self-stretch bg-bg-white overflow-hidden flex flex-col items-center justify-start py-6 px-5 box-border gap-[36.3px] max-w-full text-left text-5xl text-dark font-montserrat mq750:gap-[18px] mq1025:pt-5 mq1025:pb-5 mq1025:box-border ${className}`}
    >
      <div className="w-[1128px] flex flex-row items-start justify-start py-0 px-[22px] box-border max-w-full">
        <div className="flex-1 flex flex-row items-start justify-between max-w-full gap-5">
          <b className="relative leading-[30px] mq450:text-lgi mq450:leading-[23px]">
            Recommended (6)
          </b>
          <div className="flex flex-col items-start justify-start pt-2.5 px-0 pb-0 box-border w-5 h-5">
            <img
              className="w-5 h-2.5 relative rounded-12xs"
              loading="lazy"
              alt=""
              src="/vector-13.svg"
            />
          </div>
        </div>
      </div>
      <div className="w-[1128px] h-[279px] flex flex-col items-start justify-start pt-0 px-0 pb-[52px] box-border gap-[52px] max-w-full mq750:gap-[26px] mq1025:h-auto">
        <div className="w-[1116px] flex flex-row items-start justify-between max-w-full shrink-0 gap-5 mq1025:flex-wrap">
          <FrameComponent
            margherita="Margherita"
            prop="₹169"
            clipPathGroup="/clip-path-group.svg"
            pizzaToppedWithOurHerbInfused={`Pizza topped with our herb-infused signature pan sauce and 100% mozzarella cheese. A classic treat for all cheese lovers out there! (PAN Per/Med-292 Kcal/100g | TnC-293 Kcal/100g | Stuffed Crust Add : Per: 227 Kcal/100g | Med: 216 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.`}
          />
          <div className="w-[210px] flex flex-col items-start justify-start pt-[8.5px] px-0 pb-0 box-border">
            <div className="self-stretch h-[210px] rounded-[26.25px] flex flex-row items-center justify-between relative bg-[url('/public/rectangle-34@2x.png')] bg-cover bg-no-repeat bg-[top]">
              <img
                className="h-[210px] w-[210px] relative rounded-[26.25px] object-cover hidden z-[0]"
                alt=""
                src="/rectangle-34@2x.png"
              />
              <button className="cursor-pointer [border:none] p-0 bg-[transparent] h-[51px] w-[135px] absolute !m-[0] top-[183.8px] left-[38px] z-[1]">
                <div className="absolute top-[0px] left-[0px] shadow-[0px_11px_18px_-11px_rgba(0,_0,_0,_0.3)] rounded-xl bg-bg-white border-white border-[5px] border-solid box-border w-full h-full" />
                <b className="absolute top-[calc(50%_-_15.5px)] left-[calc(50%_-_28.5px)] text-5xl leading-[31px] inline-block font-montserrat text-tradewind text-center w-14 h-[31px] min-w-[56px] mq450:text-lgi mq450:leading-[23px]">
                  Add
                </b>
              </button>
            </div>
          </div>
        </div>
        <img
          className="self-stretch relative max-w-full overflow-hidden max-h-full"
          loading="lazy"
          alt=""
          src="/frame-3697.svg"
        />
      </div>
      <div className="w-[1128px] h-[279px] flex flex-col items-start justify-start pt-0 px-0 pb-[52px] box-border gap-[52px] max-w-full mq750:gap-[26px] mq1025:h-auto">
        <div className="w-[1116px] flex flex-row items-start justify-between max-w-full shrink-0 gap-5 mq1025:flex-wrap">
          <div className="flex flex-col items-start justify-center gap-[22px] max-w-full">
            <div className="w-[329.4px] flex flex-col items-start justify-start gap-[9px] max-w-full">
              <div className="flex flex-row items-center justify-start gap-3">
                <input className="m-0 h-5 w-[21px] relative" type="checkbox" />
                <b className="relative leading-[121.88%] mq450:text-lgi mq450:leading-[23px]">
                  Veggie Supreme
                </b>
              </div>
              <div className="self-stretch flex flex-row items-start justify-start py-0 px-0 gap-[6.6px] text-lgi-4">
                <div className="relative leading-[121.88%] font-semibold inline-block min-w-[50px] whitespace-nowrap">
                  ₹379
                </div>
                <img
                  className="h-[19.5px] w-[19.4px] relative"
                  loading="lazy"
                  alt=""
                  src="/clip-path-group.svg"
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
            <div className="flex flex-row items-center justify-center py-0 px-0 box-border max-w-full text-lgi text-label-tint">
              <div className="w-[728px] relative leading-[121.88%] font-medium inline-block shrink-0 max-w-full">{`Serves 1 | A supreme combination of black olives, green capsicum, mushroom, onion, spicy red paprika & juicy sweet corn with flavourful pan sauce and 100% mozzarella cheese. (PAN Per/Med-254 Kcal/100g | TnC-258 Kcal/100g | Stuffed Crust Add : Per: 227 Kcal/100g | Med: 216 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.`}</div>
            </div>
          </div>
          <FrameComponent1 menuItemBackground="/rectangle-341@2x.png" />
        </div>
        <img
          className="self-stretch relative max-w-full overflow-hidden max-h-full"
          loading="lazy"
          alt=""
          src="/frame-3697.svg"
        />
      </div>
      <div className="w-[1128px] h-[279px] flex flex-col items-start justify-start pt-0 px-0 pb-[52px] box-border gap-[52px] max-w-full mq750:gap-[26px] mq1025:h-auto">
        <div className="w-[1116px] flex flex-row items-start justify-between max-w-full shrink-0 gap-5 mq1025:flex-wrap">
          <FrameComponent
            propWidth="unset"
            propWidth1="330.3px"
            margherita="Tandoori Paneer"
            propPadding="unset"
            prop="₹299"
            propMinWidth="50px"
            clipPathGroup="/clip-path-group-2.svg"
            propAlignSelf="unset"
            propPadding1="0px 0px"
            pizzaToppedWithOurHerbInfused={`Serves 1 | A supreme combination of black olives, green capsicum, mushroom, onion, spicy red paprika & juicy sweet corn with flavourful pan sauce and 100% mozzarella cheese. (PAN Per/Med-254 Kcal/100g | TnC-258 Kcal/100g | Stuffed Crust Add : Per: 227 Kcal/100g | Med: 216 Kcal/100g) Contains Cereals containing Gluten (Wheat), Soya and Milk & Milk Products.`}
            propFlex="unset"
            propWidth2="728px"
          />
          <FrameComponent1
            menuItemBackground="/rectangle-34-1@2x.png"
            propRight="37px"
            propBottom="-28.8px"
          />
        </div>
        <img
          className="self-stretch relative max-w-full overflow-hidden max-h-full"
          loading="lazy"
          alt=""
          src="/frame-3697.svg"
        />
      </div>
    </section>
  );
};

PostLoginRestaurantMain1.propTypes = {
  className: PropTypes.string,
};

export default PostLoginRestaurantMain1;
