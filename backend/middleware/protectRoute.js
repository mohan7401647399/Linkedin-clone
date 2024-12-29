import jwt from "jsonwebtoken"
import User from "../model/user.model.js"

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies["jwt-linkedin"]

        if (!token) return res.status(401).json({ message: "Unauthorized" })

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) return res.status(401).json({ message: "Invalid token" })
        const user = await User.findById(decoded.userId).select('-password')

        if (!user) return res.status(401).json({ message: "User not found" })

        req.user = user
        next()

    } catch (error) {
        console.log(`Error in protect route: ${error.message}`)
        res.status(500).json({ message: `Error in protect route: ${error.message}` })
    }
}