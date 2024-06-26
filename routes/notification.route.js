import express from "express";
import notificationController from "../controllers/notification.controller.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/", protectedRoute, notificationController.getNotifications);
router.delete("/", protectedRoute, notificationController.deleteNotifications);

export default router;