import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import { createComment, createPost, deletePost, getFeedPosts, getPostById, likePost } from "../controller/post.controller.js";

const router = express.Router();

router.get('/', protectRoute, getFeedPosts)                             //  get feed posts
    .post('/create', protectRoute, createPost)                          //  create post
    .delete('/delete/:id', protectRoute, deletePost)                    //  delete post
    .get('/:id', protectRoute, getPostById)                             //  get post by id
    .post('/:id/comment', protectRoute, createComment)                  //  create a comment
    .post('/:id/like', protectRoute, likePost)                          //  like a post


export default router