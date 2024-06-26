import express from "express";
import notificationController from "../controllers/notification.controller";

const router = express.Router();

router.get("/", protectRoute, notificationController.getNotifications);
router.delete("/", protectRoute, notificationController.deleteNotifications);

export default router;