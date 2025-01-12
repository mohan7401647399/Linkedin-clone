import Notification from "../model/notification.model.js"

//  get user notifications
export const getUserNotifications = async (req, res) => {
    try {
        //  get user notifications from database
        const notifications = await Notification
            .find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")

        res.status(200).json(notifications)

    } catch (error) {
        console.log(`Error in get user notifications: ${error.message}`)
        res.status(500).json({ message: `Error in get user notifications: ${error.message}` })
    }
}

//  mark notifications as read
export const markNotificationsAsRead = async (req, res) => {
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndUpdate(
            {
                _id: notificationId, recipient: req.user._id
            }, {
                read: true
            }, {
                new: true
            })
            
            res.status(200).json(notification)
        } catch (error) {
        console.log(`Error in mark notifications as read: ${error.message}`)
        res.status(500).json({ message: `Error in mark notifications as read: ${error.message}` })
    }
}

//  delete notification
export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id
    try {
        await Notification.findOneAndDelete({_id: notificationId, recipient: req.user._id})

        res.status(200).json({ message: "Notification deleted successfully" })
    } catch (error) {
        console.log(`Error in delete notification: ${error.message}`)
        res.status(500).json({ message: `Error in delete notification: ${error.message}` })        
    }
 }