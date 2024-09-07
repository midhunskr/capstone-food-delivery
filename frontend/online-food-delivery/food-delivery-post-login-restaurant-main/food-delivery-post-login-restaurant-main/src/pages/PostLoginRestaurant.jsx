import PostLoginRestaurantMain from "../components/PostLoginRestaurantMain";
import PostLoginRestaurantMain1 from "../components/PostLoginRestaurantMain1";
import Footer2Dark from "../components/Footer2Dark";

const PostLoginRestaurant = () => {
  return (
    <div className="w-full relative overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
      <PostLoginRestaurantMain />
      <PostLoginRestaurantMain1 />
      <Footer2Dark />
    </div>
  );
};

export default PostLoginRestaurant;
