import PropTypes from "prop-types";

import { HeroSection } from "../../components/publicUsers/landing/heroSection/HeroSection";
import { MobileAppSection } from "../../components/publicUsers/landing/mobileAppSection/MobileAppSection";
import { FastestDeliverySection } from "../../components/publicUsers/FastestDeliverySection";
import { CallToAction } from "../../components/publicUsers/CallToAction";

export const PublicLandingPage = () => {
  return (
    <div>
        <HeroSection/>
        <MobileAppSection/>
        <FastestDeliverySection/>
        <CallToAction/>
    </div>
  )
}

PublicLandingPage.propTypes = {
  className: PropTypes.string,
};
