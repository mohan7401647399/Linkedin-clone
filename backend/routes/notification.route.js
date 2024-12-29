import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotification, getUserNotifications, markNotificationsAsRead } from "../controller/notification.controller.js";

const router = express.Router();

router.get('/', protectRoute, getUserNotifications)                         //  get user notifications
router.put('/:id/read', protectRoute, markNotificationsAsRead)              //  mark notifications as read
router.delete('/:id', protectRoute, deleteNotification)                        //  delete notification

export default router