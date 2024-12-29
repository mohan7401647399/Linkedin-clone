import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { getPublicProfile, getSuggestedConnections, updateProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get('/suggestions', protectRoute, getSuggestedConnections)               //  get suggested connections
    .get('/:username', protectRoute, getPublicProfile)                          //  get public profile
    .put('/profile', protectRoute, updateProfile)                               //  update profile


export default router