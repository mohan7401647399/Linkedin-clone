import cloudinary from "../lib/cloudinary.js"
import User from "../model/user.model.js"

//  get suggested connections
export const getSuggestedConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select('-password')
        if (!currentUser) return res.status(400).json({ message: "Login User not found" })

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id, $nin: currentUser.connections
            }
        }).select("name username profilePicture headline").limit(3)

        res.status(200).json(suggestedUser)
    } catch (error) {
        console.log(`Error in get suggested connections: ${error.message}`)
        res.status(500).json({ message: `Error in get suggested connections: ${error.message}` })
    }
}

//  get public profile
export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password')

        if (!user) return res.status(400).json({ message: "User not found" })

        res.status(200).json(user)
    } catch (error) {
        console.log(`Error in get public profile: ${error.message}`)
        res.status(500).json({ message: `Error in get public profile: ${error.message}` })
    }
}

//  update profile
export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name", "username", "headline", "profilePicture", "bannerImage", "location", "about", "skills", "experience", "education"
        ]
        const updatedData = {}
        for (const field of allowedFields){
            if(req.body[field]) {
                updatedData[field] = req.body[field]
            }
        }

        if(req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updatedData.profilePicture = result.secure_url
        }

        if(req.body.bannerImage) {
            const result = await cloudinary.uploader.upload(req.body.bannerImage)
            updatedData.bannerImage = result.secure_url
        }

        const user = await User.findByIdAndUpdate(req.user._id, { $set: updatedData }, { new: true }).select('-password')

        res.status(200).json(user)

    } catch (error) {
        console.log(`Error in update profile: ${error.message}`)
        res.status(500).json({ message: `Error in update profile: ${error.message}` })
    }
}