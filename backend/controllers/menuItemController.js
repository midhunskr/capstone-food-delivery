import { Menu } from "../models/menuItemModel.js";
import { cloudinaryInstance } from "../config/cloudinary.js";

//Create a menu item
export const createMenuItem = async (req, res) => {

    try {
        const {name, description, price, availability, restaurantId} = req.body
        

        //Upload an image
        let uploadedImage = null;
        if (req.file) {
            try {
                uploadedImage = await cloudinaryInstance.uploader.upload(req.file.path)
            } catch (error) {
                console.error('Image upload failed:', error)
                return res.status(500).json({ success: false, message: 'Image upload failed' })
            }
        }

        //New menu instance
        const menuItem = new Menu({
            name,
            description,
            price,
            availability,
            //The URL of the uploaded image, if any (or null if no image was provided)
            image: uploadedImage ? uploadedImage.url : null,
            restaurant: restaurantId
        })

        //Save the menu item
        const createdMenuItem = await menuItem.save()

        //Success response
        res.status(201).json({ success: true, message: `${createdMenuItem.name} created successfully` })

    } catch (error) {
        console.error('Error creating menu item', error);
        res.status(500).json({ success: false, message: 'Server error, unable to create menu item' })
    }
    
}

//Get all menu items for a restaurant
export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await Menu.find({restaurant: req.params.restaurantId})
        res.status(201).json({success: true, message: 'All items fetched successfully', menuItems})
    } catch (error) {
        res.status(404).json({success: false, message: 'Items not found'})
    }
}

//Get menu item by Id
export const menuItemById = async (req, res) => {
    try {
        const itemById = await Menu.findById(req.params.id)
        res.status(201).json({success: true, message: itemById.name +  ' data received successfully', itemById})

    } catch (error) {
        res.status(404).json({success: false, message: 'Items not found'})
    }
}

//Update menu item
export const updateMenuItem = async (req, res) => {
    try {
        await Menu.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(201).json({ success: true, message: 'Item updated' })
    } catch (error) {
        res.status(404).json({ success: false, message: 'Item not found' })
    }
}

//Delete menu item
export const deleteMenuItem = async (req, res) => {
    try {
        await Menu.findOneAndDelete(req.params.id)
        res.status(201).json({success: true, message: 'Item deleted'})
    } catch (error) {
        res.status(404).json({success: false, message: 'Item not found'})
    }
}