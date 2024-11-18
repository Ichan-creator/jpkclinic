import dayjs from "dayjs";
import { Notifications } from "../models/index.models.js";

async function handleClinicDirectory(req, res) {
  const notifications = await Notifications.findAll({
    where: { userId: req.user.id },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const formattedNotifications = notifications.map((notification) => {
    return {
      ...notification,
      timeAgo: dayjs(notification.createdAt).fromNow(),
    };
  });

  res.render("clinicDirectory", {
    notifications: formattedNotifications,
    fullName: req.user.fullName,
    avatar: req.user.avatar,
  });
}

export default handleClinicDirectory;
