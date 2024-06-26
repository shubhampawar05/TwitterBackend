import notificationModel from "../models/notification.model.js";
import { catchAsync } from "../middlewares/errorHandler.js";
const getNotifications = async (req, res) => {
  const userId = req.user._id;

  const notifications = await notificationModel.find({ to: userId }).populate({
    path: "from",
    select: "username profileImg",
  });

  await notificationModel.updateMany({ to: userId }, { read: true });

  res.status(200).json(notifications);
};

const deleteNotifications = async (req, res) => {
  const userId = req.user._id;

  await notificationModel.deleteMany({ to: userId });

  res.status(200).json({ message: "Notifications deleted successfully" });
};

const notificationController = {
  getNotifications: catchAsync(getNotifications),
  deleteNotifications: catchAsync(deleteNotifications),
};

export default notificationController;
