import { Restaurant } from "../models/restaurantModel.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

// // Create a restaurant
// export const createRestaurant = async (req, res) => {
//     try {

//         const { name, description, location } = req.body;
//         const menuItems = [];

//         // Iterate through menu items
//         for (let i = 0; i < 3; i++) {
//             const itemName = req.body[`menuItems[${i}].name`];
//             const itemPrice = req.body[`menuItems[${i}].price`];
//             const itemDescription = req.body[`menuItems[${i}].description`];
//             const itemImageFile = req.files[`menuItems[${i}].image`]?.[0]; // Access the correct file

//             let uploadedImage = null;
//             if (itemImageFile) {
//                 try {
//                     uploadedImage = await cloudinaryInstance.uploader.upload(itemImageFile.path);
//                 } catch (error) {
//                     console.error(`Image upload failed for menu item ${itemName}:`, error);
//                     return res.status(500).json({ success: false, message: `Image upload failed for menu item ${itemName}` });
//                 }
//             }
            

//             // Add the menu item with the uploaded image URL to the processedMenuItems array
//             menuItems.push({
//                 name: itemName,
//                 price: itemPrice,
//                 description: itemDescription,
//                 image: uploadedImage ? uploadedImage.secure_url : '', // Store the Cloudinary image URL
//             });

//             console.log(menuItems);
//         }
        

//         // Create new Restaurant
//         const restaurant = new Restaurant({
//             name,
//             description,
//             location,
//             menuItems,
//             user: req.user._id
//         });

//         // Save restaurant data
//         const createdRestaurant = await restaurant.save();

//         // Success response
//         res.status(201).json({
//             success: true,
//             message: `New restaurant '${createdRestaurant.name}' has been created successfully!`,
//             data: createdRestaurant
//         });

//     } catch (error) {
//         // Handle any errors that occur during the process
//         console.error('Error:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Server Error: Could not create restaurant',
//             error: error.message
//         });
//     }
// };

// Create a restaurant
export const createRestaurant = async (req, res) => {
    try {
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        const { name, description, location } = req.body;

        const menuItemKeys = Object.keys(req.body).filter(key => key.startsWith('menuItems'));
        const menuItemIndices = [...new Set(menuItemKeys.map(key => key.match(/\[(\d+)\]/)[1]))];

        const menuItems = await Promise.all(menuItemIndices.map(async (index) => {
            const itemName = req.body[`menuItems[${index}].name`];
            const itemPrice = req.body[`menuItems[${index}].price`];
            const itemDescription = req.body[`menuItems[${index}].description`];
            const itemImageFile = req.files[`menuItems[${index}].image`]?.[0];

            if (!itemName || !itemPrice || !itemDescription) {
                return null; // Skip incomplete items
            }

            let uploadedImage = null;
            if (itemImageFile) {
                try {
                    uploadedImage = await cloudinaryInstance.uploader.upload(itemImageFile.path);
                } catch (error) {
                    throw new Error(`Image upload failed for ${itemName}`);
                }
            }

            return {
                name: itemName,
                price: itemPrice,
                description: itemDescription,
                image: uploadedImage ? uploadedImage.secure_url : '',
            };
        }));

        // Filter out null items
        const validMenuItems = menuItems.filter(item => item !== null);

        // Create the restaurant
        const restaurant = new Restaurant({
            name,
            description,
            location,
            menuItems: validMenuItems,
            user: req.user._id
        });

        const createdRestaurant = await restaurant.save();

        // Send the response
        res.status(201).json({
            success: true,
            message: `New restaurant '${createdRestaurant.name}' has been created successfully!`,
            data: createdRestaurant
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not create restaurant',
            error: error.message
        });
    }
};



//Get all restaurant
export const getRestaurant = async(req, res) =>{
    //Find restaurants and save to variable 'restaurants' and replace with populate('user, 'name') from Restaurant schema
    const restaurants = await Restaurant.find().populate('user', 'name')

    //Error handling
    if (restaurants){
        res.status(200).json({success: true, message: "All restaurants has been listed successfully!", restaurants})
        
    } else {
        res.status(404).json({success: false, message: 'Restaurant not found'})
    }
}

// Get restaurant by ID
export const getRestaurantById = async (req, res) => {
    //Find restaurant by Id and save to variable 'restaurants' and replace with populate('user, 'name') from Restaurant schema
    const restaurant = await Restaurant.findById(req.params.id).populate('user', 'name')

    //Success response
    if (restaurant) {
        res.status(200).json({success: true, message: "Restaurant '" + restaurant.name + "' listed successfully!", restaurant})
        
    //Error handling
    } else {
        res.status(404).json({success: false, message: 'Restaurant not found' })
    }
}

// Update restaurant
export const updateRestaurant = async (req, res) => {

    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json({success: true, message: "Restaurant '" + restaurant.name + "' updated successfully!", restaurant})

    } catch (error) {
        res.status(404).json({ success: false, message: 'Restaurant not found' })
    } 
}

//Delete restaurant
export const deleteRestaurant = async (req, res) => {

    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id)
        res.status(201).json({success: true, message: "Restaurant '" + restaurant.name + "' deleted successfully!", restaurant})
    } catch (error) {
        res.status(404).json({success: false, message: 'Restaurant not found'})
    }
}

