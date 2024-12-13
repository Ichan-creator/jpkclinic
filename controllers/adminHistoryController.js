import dayjs from "dayjs";
import { Notifications } from "../models/index.models.js";

async function handleGetAdminHistory(req, res) {
  const notifications = await Notifications.findAll({
    where: { type: "admin" },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  const formattedNotifications = notifications.map((notification) => {
    return {
      ...notification,
      timeAgo: dayjs(notification.createdAt).fromNow(),
    };
  });

  res.render("adminHistory", {
    notifications: formattedNotifications,
    adminName: req.user.fullName,
  });
}

export { handleGetAdminHistory };
