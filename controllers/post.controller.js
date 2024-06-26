import userModel from "../models/user.model.js";
import postModel from "../models/post.model.js";
import { v2 as cloudinary } from "cloudinary";
import { catchAsync } from "../middlewares/errorHandler.js";
import notificationModel from "../models/notification.model.js";

const createPost = async (req, res) => {
	
		const { text } = req.body;
		let { img } = req.body;
		const userId = req.user._id.toString();

		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ message: "User not found" });

		if (!text && !img) {
			return res.status(400).json({ error: "Post must have text or image" });
		}

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

		const newPost = new postModel({
			user: userId,
			text,
			img,
		});

		await newPost.save();
		res.status(201).json(newPost);
	
};

const deletePost = async (req, res) => {
	
		const post = await postModel.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		if (post.user.toString() !== req.user._id.toString()) {
			return res.status(401).json({ error: "You are not authorized to delete this post" });
		}

		if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await postModel.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Post deleted successfully" });
	
};

const commentOnPost = async (req, res) => {
	
		const { text } = req.body;
		const postId = req.params.id;
		const userId = req.user._id;

		if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}
		const post = await postModel.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const comment = { user: userId, text };

		post.comments.push(comment);
		await post.save();

		res.status(200).json(post);
	
};

 const likeUnlikePost = async (req, res) => {
	
		const userId = req.user._id;
		const { id: postId } = req.params;

		const post = await postModel.findById(postId);

		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

		const userLikedPost = post.likes.includes(userId);

		if (userLikedPost) {
			// Unlike post
			await postModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
			await userModel.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

			const updatedLikes = post.likes.filter((id) => id.toString() !== userId.toString());
			res.status(200).json(updatedLikes);
		} else {
			// Like post
			post.likes.push(userId);
			await userModel.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
			await post.save();

			const notification = new notificationModel({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			res.status(200).json(updatedLikes);
		}
	
};

 const getAllPosts = async (req, res) => {
	
		const posts = await postModel.find()
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		if (posts.length === 0) {
			return res.status(200).json([]);
		}

		res.status(200).json(posts);
	
};

 const getLikedPosts = async (req, res) => {
	const userId = req.params.id;
		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await postModel.find({ _id: { $in: user.likedPosts } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
	
};

 const getFollowingPosts = async (req, res) => {

		const userId = req.user._id;
		const user = await userModel.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const following = user.following;

		const feedPosts = await postModel.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(feedPosts);
	
};

 const getUserPosts = async (req, res) => {
	
		const { username } = req.params;

		const user = await userModel.findOne({ username });
		if (!user) return res.status(404).json({ error: "User not found" });

		const posts = await postModel.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(posts);
	
};

const postController ={
    createPost:catchAsync(createPost),
    deletePost:catchAsync(deletePost),
    commentOnPost:catchAsync(commentOnPost),
    likeUnlikePost:catchAsync(likeUnlikePost),
    getAllPosts:catchAsync(getAllPosts),
    getLikedPosts:catchAsync(getLikedPosts),
    getFollowingPosts:catchAsync(getFollowingPosts),
    getUserPosts:catchAsync(getUserPosts),
}

export default postController;