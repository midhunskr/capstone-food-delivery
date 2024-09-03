import PropTypes from "prop-types";
import { HeroSection } from "../../components/landing/heroSection/HeroSection";
import { MobileAppSection } from "../../components/landing/mobileAppSection/MobileAppSection";
import { FastestDeliverySection } from "../../components/landing/FastestDeliverySection";
import { CallToAction } from "../../components/landing/CallToAction";

export const HomePage = () => {
  return (
    <div>
        <HeroSection/>
        <MobileAppSection/>
        <FastestDeliverySection/>
        <CallToAction/>
    </div>
  )
}

HomePage.propTypes = {
  className: PropTypes.string,
};
