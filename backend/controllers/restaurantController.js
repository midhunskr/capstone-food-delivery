import { Restaurant } from "../models/restaurantModel.js"

//Create a restaurant
export const createRestaurant = async (req, res) => {
    
    try {
        //Import and assign required fields from req.body to variables
        const { name, description, location} = req.body

        //error handling for restaurant exist
        let restaurantExist = await Restaurant.findOne({ name, description, location })
        if (restaurantExist) {
            return res.status(400).json({ success: false, message: `Restaurant '${restaurantExist.name}' already exists at '${restaurantExist.location}' with same 'description'!` })
        }

        //Create new Restaurant
        const restaurant = new Restaurant({
            name,
            description,
            location,
            user: req.user._id
        })

        //Save restaurant data
        const createdRestaurant = await restaurant.save()

        //Success response
        res.status(201).json({
            success: true,
            message:  "New restaurant " + "'" + createdRestaurant.name + "'" + " has been created successfully!",
            data: createdRestaurant
        })

    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({
            success: false,
            message: 'Server Error: Could not create restaurant',
            error: error.message
        })
    }
}

//Get all restaurant
export const getRestaurant = async(req, res) =>{
    //Find restaurants and save to variable 'restaurants' and replace with populate('user, 'name') from Restaurant schema
    const restaurants = await Restaurant.find().populate('user', 'name')

    //Error handling
    if (restaurants){
        res.status(404).json({success: true, message: "All restaurants has been listed successfully!", restaurants})
        
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
        res.status(404).json({success: true, message: "Restaurant '" + restaurant.name + "' listed successfully!", restaurant})
        
    //Error handling
    } else {
        res.status(404).json({success: false, message: 'Restaurant not found' })
    }
}

//Update restaurant
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
        const restaurant = await Restaurant.findOneAndDelete(req.params.id)
        res.status(201).json({success: true, message: "Restaurant '" + restaurant.name + "' deleted successfully!", restaurant})
    } catch (error) {
        res.status(404).json({success: false, message: 'Restaurant not found'})
    }
}

