import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Notifications, User } from "../models/index.models.js";

dayjs.extend(relativeTime);

async function handleClientNav(req, res) {
  if (req.user.role === "admin") {
    return res.redirect("/admin");
  }

  const user = await User.findOne({ where: { id: req.user.id }, raw: true });

  const isFirstTimeLogin = user.isFirstTimeLogin;

  if (isFirstTimeLogin) {
    return res.redirect("/personal-page?firstTimeLogin=true");
  }

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

  res.render("clientNav", {
    notifications: formattedNotifications,
    fullName: user.fullName,
    avatar: user.avatar,
  });
}

export default handleClientNav;
