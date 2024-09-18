import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createRestaurant } from "../../services/restaurantApi";
import { adminLogin, adminLogout, userLogout } from "../../services/userApi";
import { getAllRestaurants } from "../../services/restaurantApi";

export const AdminProfile = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [restaurants, setRestaurants] = useState([])
  const [isOpen, setIsOpen] = useState(false); // State to toggle dropdown
  const [selected, setSelected] = useState(null); // State to store selected item
  const [menuItems, setMenuItems] = useState([{ name: '', price: '', category: '', image: null }]);

  const sections = [
    { name: 'Manage Restaurants', content: 'Content for managing restaurants' },
    { name: 'List all restaurants', content: restaurants },
    { name: 'Logout', content: 'Content for logging out' },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const navigate = useNavigate();

  // Handle restaurant form submission
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("location", data.location);

    menuItems.forEach((item, index) => {
      formData.append(`menuItems[${index}].name`, item.name);
      formData.append(`menuItems[${index}].price`, item.price);
      formData.append(`menuItems[${index}].category`, item.category);
      formData.append(`menuItems[${index}].image`, item.image);
    });

    try {
      const response = await createRestaurant(formData);
      if (response.success) {
        toast.success('Restaurant created successfully');
        navigate('/admin');
      } else {
        toast.error('Failed to create restaurant');
      }
    } catch (error) {
      toast.error('Error: Could not create restaurant');
      console.error(error);
    }
  };

  //Fetch all restaurants
  useEffect(() => {
    if (activeIndex === 1) {
      const fetchRestaurants = async () => {
        try {
          const data = await getAllRestaurants();
          if (data && data.success) {
            setRestaurants(data.restaurants || []);
          }
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      };

      fetchRestaurants();
    }
  }, [activeIndex]);

  // Handle adding new menu item
  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', price: '', category: '', image: null }]);
  };

  // Handle menu item field changes
  const handleMenuItemChange = (index, field, value) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index][field] = value;
    setMenuItems(updatedMenuItems);
  };

  // Handle file input change for menu item image
  const handleFileChange = (index, file) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].image = file;
    setMenuItems(updatedMenuItems);
  };

  const handleLogout = async () => {
    const response = await adminLogout();
    if (response?.success) {
      navigate('/admin/login');
    }
  };

  const handleSelect = (option) => {
    setSelected(option);
    setIsOpen(false); // Close dropdown after selection
  };

  return (
    <div className="self-stretch flex flex-col bg-bg-white items-center justify-center py-[0rem] px-[1.25rem] pb-[2rem] box-border max-w-full text-left text-[1.5rem] text-dark">
      <div className="h-full w-[70.5rem] flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0rem] box-border gap-[2.012rem] max-w-full">
        <div className="flex flex-col py-[2rem] pl-[0.5rem] pr-[0rem] box-border shrink-0 max-w-full gap-[1.25rem]">
          <b>Hi there!</b>
        </div>
        <div className="flex items-start justify-center gap-[6rem]">
          <div className="flex gap-[4rem] items-center">
            {/* Left Side Menu */}
            <div className="w-[22rem] border-r border-gray-300">
              <ul className="space-y-8 list-none">
                {sections.map((section, index) => (
                  <li
                    key={index}
                    className={`cursor-pointer p-2 rounded-md ${activeIndex === index ? 'bg-tradewind text-bg-white' : 'hover:bg-gray-300'}`}
                    onClick={() => setActiveIndex(index)}
                  >
                    {section.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Right Side Content */}
          <div className="w-7/12 border-[.1rem] border-solid border-selection-tint px-[2rem] py-[2rem] rounded-xl">
            {activeIndex === 0 ? (
              <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                <div className="input-box flex flex-col">
                  <label htmlFor="#">Name</label>
                  <input type="text" {...register("name")} placeholder="Enter restaurant name*" required />
                </div>
                <div className="input-box flex flex-col">
                  <label htmlFor="#">Description</label>
                  <input type="text" {...register("description")} placeholder="Enter description*" required />
                </div>
                <div className="input-box flex flex-col">
                  <label htmlFor="#">Location</label>
                  <input type="text" {...register("location")} placeholder="Enter location*" required />
                </div>

                <div className="text-[1rem] flex flex-col">
                  <label className="font-bold" htmlFor="#">Food Items</label>
                </div>

                {menuItems.map((item, index) => (
                  <div key={index} className="mb-4">
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].name`}>Item Name</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleMenuItemChange(index, 'name', e.target.value)}
                        placeholder="Enter food item name*"
                        required
                      />
                    </div>
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].price`}>Price</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleMenuItemChange(index, 'price', e.target.value)}
                        placeholder="Enter price*"
                        required
                      />
                    </div>
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].veg`}>Veg or Non-veg</label>
                      <input
                        type="text"
                        value={item.veg}
                        onChange={(e) => handleMenuItemChange(index, 'veg', e.target.value)}
                        placeholder="Enter Veg or non-veg*"
                        required
                      />
                    </div>
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].category`}>Category</label>
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => handleMenuItemChange(index, 'category', e.target.value)}
                        placeholder="Enter category*"
                        required
                      />
                    </div>
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].recommended`}>Featured or Non-featured</label>
                      <input
                        type="text"
                        value={item.recommended}
                        onChange={(e) => handleMenuItemChange(index, 'recommended', e.target.value)}
                        placeholder="Enter featured or Non-featured*"
                        required
                      />
                    </div>
                    <div className="input-box flex flex-col">
                      <label htmlFor={`menuItems[${index}].image`}>Image</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                        required
                      />
                    </div>
                  </div>
                ))}
                <div className="flex flex-col gap-4 ">
                  <button type="button" onClick={addMenuItem} className="bg-bg-white text-tradewind py-[.5rem] rounded-md text-lg border-[.14rem] border-solid border-tradewind">
                    Add More Items
                  </button>

                  <button type="submit" className="bg-tradewind py-[.5rem] rounded-md text-lg">
                    Add Restaurant
                  </button>
                </div>
              </form>
            ) : activeIndex === 1 ? (
              <div>
                {/* Display all restaurants */}
                {restaurants.length > 0 ? (
                  restaurants.map((restaurant) => (
                    <div key={restaurant._id}>
                      <h3>{restaurant.name}</h3>
                      <p>{restaurant.location}</p>
                      <p>{restaurant.description}</p>
                    </div>
                  ))
                ) : (
                  <p>No restaurants available</p>
                )}
              </div>
            ) : (
              <div className="">
                <button className="bg-bg-white text-tradewind py-[.5rem] rounded-md text-lg border-[.14rem] border-solid border-tradewind px-[1rem] hover:bg-tradewind hover:text-bg-white hover:cursor-pointer" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

AdminProfile.propTypes = {
  className: PropTypes.string,
};
