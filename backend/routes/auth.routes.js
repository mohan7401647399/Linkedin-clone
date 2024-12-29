import express from "express";
import { getUser, login, logout, signup } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post('/signup', signup)              //  signup
    .post('/login', login)                  //  login
    .post('/logout', logout)                //  logout
    .get('/getUser', protectRoute, getUser) //  get user

export default router