import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    author:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
    },
    image :{
        type: String
    }, 
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: "User"
        }
    ],
    comments:[
        {
            content: {
                type: String
            },
            user : {
                type: mongoose.Types.ObjectId,
                ref: "User"
            },
            createdAt:{
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)

export default Post