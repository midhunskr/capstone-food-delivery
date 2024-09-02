import PropTypes from "prop-types";
import { ItemScroller } from "../../components/user/ItemScroller";
import { RestaurantListing } from "../../components/user/RestaurantListing";
import { CuisineListing } from "../../components/user/CuisineListing";


export const HomePage = () => {
  return (
    <div>
      <div className="w-full relative overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
        <section className="self-stretch bg-bg-white flex flex-col items-start justify-start pt-[2rem] px-[0rem] pb-[6.412rem] box-border gap-[4.25rem] max-w-full lg:pb-[4.188rem] lg:box-border mq450:gap-[1.063rem] mq750:gap-[2.125rem] mq750:pb-[2.75rem] mq750:box-border">
          {/* <UserHeader /> */}
          <ItemScroller />
          <RestaurantListing />
          <CuisineListing />
        </section>
      </div>
    </div>
  )
}

HomePage.propTypes = {
  className: PropTypes.string,
};
