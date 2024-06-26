import express from "express";
import authController from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();


router.post('/signup',authController.signup )
router.post('/login',authController.login )
router.get('/logout',authController.logout )
router.get('/me',protectedRoute,authController.getMe )


export default router