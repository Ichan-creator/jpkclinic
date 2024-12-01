import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Appointments, Notifications, User } from "../models/index.models.js";
import { Op } from "sequelize";

dayjs.extend(relativeTime);

async function handleClientNav(req, res) {
  if (req.user.role === "admin") {
    return res.redirect("/admin");
  }

  const user = await User.findOne({
    where: { id: req.user.id },
    raw: true,
  });

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

  console.log(user["appointments.appointmentDate"]);

  res.render("clientNav", {
    notifications: formattedNotifications,
    fullName: user.fullName,
    avatar: user.avatar,
  });
}

async function handleGetUpcomingAppointmentsList(req, res) {
  const userId = req.user.id;

  const appointmentsList = await Appointments.findAll({
    attributes: ["id", "appointmentDate", "service", "dateApproved"],
    where: {
      userId,
      dateApproved: { [Op.ne]: "cancelled" },
      medicalRecordStatus: { [Op.ne]: "COMPLETE" },
    },
    raw: true,
  });

  if (!appointmentsList) return res.status(404).json([]);

  res.json(appointmentsList);
}

export { handleClientNav, handleGetUpcomingAppointmentsList };
