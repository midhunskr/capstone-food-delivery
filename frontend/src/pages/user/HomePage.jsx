import PropTypes from "prop-types";
import { UserLanding } from "../../components/user/UserLanding";

export const HomePage = () => {
  return (
    <div>
        <UserLanding/>
    </div>
  )
}

HomePage.propTypes = {
  className: PropTypes.string,
};
