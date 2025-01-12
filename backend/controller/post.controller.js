import { sendCommendNotificationEmail } from "../emails/emailHandlers.js"
import cloudinary from "../lib/cloudinary.js"
import Notification from "../model/notification.model.js"
import Post from "../model/post.model.js"

//  get feed posts
export const getFeedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        console.error(`Error in get feed posts: ${error.message}`)
        res.status(500).json({ message: `Error in get feed posts: ${error.message}` })
    }
}

//  create post
export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body
        let newPost

        if (image) {
            const imageResult = await cloudinary.uploader.upload(image)
            newPost = new Post({
                author: req.user._id,
                content,
                image: imageResult.secure_url
            })
        } else {
            newPost = new Post({
                author: req.user._id,
                content
            })
        }
        await newPost.save()

        res.status(201).json(newPost)
    } catch (error) {
        console.error(`Error in create post: ${error.message}`)
        res.status(500).json({ message: `Error in create post: ${error.message}` })
    }
}

//  delete post
export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id,                   //  get post id
            userId = req.user._id,                      //  get user id
            post = await Post.findById(postId)          //  get post in database

        if (!post) return res.status(404).json({ message: "Post not found" })

        if (post.author.toString() !== userId.toString()) return res.status(401).json({ message: "You are not Unauthorized to delete this post" })

        if (post.image) {
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        await Post.findByIdAndDelete(postId)

        res.status(200).json({ message: "Post deleted successfully" })

    } catch (error) {
        console.error(`Error in delete post: ${error.message}`)
        res.status(500).json({ message: `Error in delete post: ${error.message}` })
    }
}

//  get post by id
export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
            .populate("author", "name username profilePicture headline")
            .populate("comments.user", "name username headline profilePicture")

        res.status(200).json(post)
    } catch (error) {
        console.error(`Error in get post by id: ${error.message}`)
        res.status(500).json({ message: `Error in get post by id: ${error.message}` })
    }
}

//  create a comment
export const createComment = async (req, res) => {
    try {
        const postId = req.params.id
        const { content } = req.body
        const post = await Post.findByIdAndUpdate(postId, { $push: { comments: { user: req.user._id, content } } }, { new: true })
            .populate("author", "name email username profilePicture headline")

        // create a notification if the comment owner is not the post owner  
        if (post.author._id.toString() !== req.user._id.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: req.user._id,
                relatedPost: postId
            })
            await newNotification.save()

            //  send comment notification email
            try {
                const postUrl = process.env.CLIENT_URL + '/post/' + postId
                await sendCommendNotificationEmail(
                    post.author.email,
                    post.author.name,
                    req.user.name,
                    content,
                    postUrl
                )

            } catch (error) {
                console.error(`Error in send comment notification email: ${error.message}`)
            }
        }

        res.status(200).json(post)

    } catch (error) {
        console.error(`Error in create a comment: ${error.message}`)
        res.status(500).json({ message: `Error in create a comment: ${error.message}` })
    }
}

//  like a post
export const likePost = async (req, res) => {
    try {
        const postId = req.params.id,
            post = await Post.findById(postId),
            userId = req.user._id

        if (post.likes.includes(userId)) {
            //  Unlike the post
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString())
        } else {
            //  Like the post
            post.likes.push(userId)

            if (post.author.toString() !== userId.toString()) {
                const newNotification = new Notification({
                    recipient: post.author,
                    type: "like",
                    relatedUser: userId,
                    relatedPost: postId
                })
                await newNotification.save()
            }
        }
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        console.error(`Error in like a post: ${error.message}`)
        res.status(500).json({ message: `Error in like a post: ${error.message}` })
    }
}