import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandlers.js"

//  signup user
export const signup = async (req, res) => {
    try {
        const { name, username, email, password } = req.body

        if (!name || !username || !email || !password) return res.status(400).json({ message: "All fields are required" })

        const existingEmail = await User.findOne({ email })
        if (existingEmail) return res.status(400).json({ message: "Email already exists" })

        const existingUsername = await User.findOne({ username })
        if (existingUsername) return res.status(400).json({ message: "Username already exists" })

        if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword
        })

        await user.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3*  24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({ message: "User created successfully" })

        const profileUrl = process.env.CLIENT_URL + '/profile/' + user.username

        try {
            await sendWelcomeEmail(user.email, user.name, profileUrl)
        } catch (error) {
            console.log(`Error in sending welcome email: ${error.message}`)
        }

    } catch (error) {
        console.log(`Error in signup user: ${error.message}`)
        res.status(500).json({ message: `Error in signup user: ${error.message}` })
    }
}

//  login user
export const login = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

        await res.cookie("jwt-linkedin", token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        res.status(200).json({ message: "User logged in successfully" })

    } catch (error) {
        console.log(`Error in login user: ${error.message}`)
        res.status(500).json({ message: `Error in login user: ${error.message}` })
    }
}

//  logout user
export const logout = (req, res) => {
    try {
        res.clearCookie("jwt-linkedin")
        //  res.status(200).json({ message: "User logged out successfully" })
        res.json({ message: "User logged out successfully" })
    } catch (error) {
        console.log(`Error in logout user: ${error.message}`)
        res.status(500).json({ message: `Error in logout user: ${error.message}` })
    }
}

//  get user
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.json(req.user)
    } catch (error) {
        console.log(`Error in get user: ${error.message}`)
        res.status(500).json({ message: `Error in get user: ${error.message}` })
    }
}