import express from "express";
import postController from "../controllers/post.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();



router.get("/all", protectedRoute, postController.getAllPosts);
router.get("/following", protectedRoute, postController.getFollowingPosts);
router.get("/likes/:id", protectedRoute, postController.getLikedPosts);
router.get("/user/:username", protectedRoute, postController.getUserPosts);
router.post("/create", protectedRoute, postController.createPost);
router.post("/like/:id", protectedRoute, postController.likeUnlikePost);
router.post("/comment/:id", protectedRoute, postController.commentOnPost);
router.delete("/:id", protectedRoute, postController.deletePost);

export default router