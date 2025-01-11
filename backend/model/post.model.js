import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,                 // Removes unnecessary whitespace from the beginning and end
        },
        image: {
            type: String,
        },
        likes: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                content: {
                    type: String,
                    required: true,                         // Ensures comments cannot be empty
                    trim: true,
                },
                user: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                    required: true,                         // Ensures the comment must have a user associated
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,                       // Automatically adds `createdAt` and `updatedAt` fields
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
