// import { User } from "../models/userModel.js"
// import bcrypt from 'bcrypt'
// import { generateUserToken } from "../utils/generateToken.js"

// // Register User
// export const registerUser = async (req, res, next) => {
    
//     try {
//         const { name, email, password, phone} = req.body

//         //error handling for missing field
//         if (!name || !email || !password || !phone) {
//             res.status(400).json({success: false, message: "All fields are required"})
//         }

//         //error handling for user exist
//         let userExist = await User.findOne({ email });
//         if (userExist) {
//             return res.status(400).json({ success: false, message: 'User already exists' });
//         }

//         //hashing password
//         const salt = 10
//         const hashedPassword = bcrypt.hashSync(password, salt)

//         //save new user to database
//         const newUser = new User({name, email, password: hashedPassword, phone})
//         await newUser.save()

//         //tokenize user data
//         const token = generateUserToken(email)

//         //assign token to cookie
//         res.cookie('token', token)
//         res.json({success: true, message: "User created successfully!"})

//     } catch (error) {
//         res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
//     }
// }

// // Login User
// export const loginUser = async (req, res, next) => {
    
//     try {
//         const { email, password} = req.body

//         //error handling for missing field
//         if (!email || !password) {
//             res.status(400).json({success: false, message: "All fields are required"})
//         }

//         //error handling for user exist
//         let userExist = await User.findOne({ email });
//         if (!userExist) {
//             return res.status(404).json({ success: false, message: 'User does not exists' })
//         }

//         //compare password
//         const passwordMatch = bcrypt.compareSync(password, userExist.password)
//         if(!passwordMatch) {
//             return res.status(400).json({success: false, messaage: "Password does not match."})
//         }

//         //tokenize user data
//         const token = generateUserToken(email)

//         //assign token to cookie
//         res.cookie('token', token)
//         res.json({success: true, message: "User login successfully!"})

//     } catch (error) {
//         res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
//     }
// }

// //User Profile
// export const userProfile = async (req, res, next) => {
    
//     try {
//         //Destructure 'id' frpm params
//         const {id} = req.params
//         //Find user by Id and store the data in userData variable (exclude user password)
//         const userData = await User.findById(id).select("-password")

//         //Sucess response
//         res.json({success: true, message: "User profile accessed successfully!", data: userData})

//     } catch (error) {
//         res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
//     }
// }

// //Check user
// export const checkUser = async (req, res, next) => {
    
//     try {
//         //Fetch verified user from 'authMiddleware/authUser'
//         const user = req.user
//         //Error handling
//         if(!user) {
//             return res.status(400).json({success: false, messaage:'authUser failed, user not authenticated'})
//         }

//         //Sucess response
//         res.json({success: true, message: "User profile checked successfully!"})

//     } catch (error) {
//         res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
//     }
// }





import { User } from "../models/userModel.js"
import bcrypt from 'bcrypt'
import { generateUserToken } from "../utils/generateToken.js"

// Register User
export const registerUser = async (req, res) => {
    
    try {
        const { name, email, password, role, phone} = req.body

        //error handling for missing field
        if (!name || !email || !password || !role || !phone) {
            res.status(400).json({success: false, message: "All fields are required"})
        }

        //error handling for user exist
        let userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        //hashing password
        const salt = 10
        const hashedPassword = bcrypt.hashSync(password, salt)

        //save new user to database
        const newUser = new User({name, email, password: hashedPassword, role, phone})
        await newUser.save()

        //tokenize user data
        const token = generateUserToken(email)

        //assign token to cookie
        res.cookie('token', token)
        res.json({success: true, message: role + " created successfully!"})

    } catch (error) {
        res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
    }
}

// Login User
export const loginUser = async (req, res) => {
    
    try {
        const { email, password} = req.body

        //Error handling for missing field
        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"})
        }

        //Error handling for user not exist
        const user = await User.findOne({ email });
        // if (!user) {
        //     return res.status(404).json({ success: false, message: 'User does not exists' })
        // }

        //Compare password
        const passwordMatch = bcrypt.compareSync(password, user.password)
        if(!passwordMatch) {
            return res.status(401).json({success: false, messaage: "Password does not match."})
        }

        //Tokenize user data
        const token = generateUserToken(user.id, user.role)

        //Assign token to cookie
        res.cookie('token', token)

        //Success response
        res.json({
            success: true,
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token,
            message: `${user.role} login successfully!`
        })

    } catch (error) {
        return res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
    }
}

//User Profile
export const userProfile = async (req, res) => {
    
    try {
        //Destructure 'id' from params
        const {id} = req.params

        //Find user by Id and store the data in userData variable (exclude user password)
        const userData = await User.findById(id).select("-password")

        //Sucess response
        res.json({success: true, message: userData.role + " profile accessed successfully!", data: userData})

    } catch (error) {
        res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
    }
}

//Check user
export const checkUser = async (req, res, next) => {
    
    try {
        //Fetch verified user from 'authMiddleware/authUser'
        const user = req.user
        //Error handling
        if(!user) {
            return res.status(400).json({success: false, messaage:'authUser failed, user not authenticated'})
        }

        //Sucess response
        res.json({success: true, message: "User profile checked successfully!"})

    } catch (error) {
        res.status(error.status || 500).json({message: error.messaage || 'Internal server error'})
    }
}