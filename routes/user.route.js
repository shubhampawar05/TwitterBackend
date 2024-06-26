import express from "express";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import userConrtoller from "../controllers/user.controller.js";

const router = express.Router();


router.get('/profile/:userName',protectedRoute,userConrtoller.profile )
router.get('/sugessted',protectedRoute, userConrtoller.getSuggestedUsers  )
router.post('/follow/:id',protectedRoute,userConrtoller.followOrUnfollow )
router.post('/update',protectedRoute,userConrtoller.updateUser )



export default router