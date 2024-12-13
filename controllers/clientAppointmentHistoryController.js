import dayjs from "dayjs";
import {
  Appointments,
  Notifications,
  Pets,
  User,
} from "../models/index.models.js";
import { Op } from "sequelize";

async function handleGetClientAppointmentHistory(req, res) {
  const user = await User.findOne({
    where: { id: req.user.id },
    raw: true,
  });

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

  res.render("clientAppointmentHistory", {
    notifications: formattedNotifications,
    fullName: user.fullName,
    avatar: user.avatar,
  });
}

async function handleGetClientAppointmentHistoryList(req, res) {
  const clientAppointmentsHistoryList = await Appointments.findAll({
    attributes: ["service", "appointmentDate", "veterinarian"],
    include: {
      model: Pets,
      attributes: ["id", "animalType", "breed", "name"],
    },
    where: {
      userId: req.user.id,
      appointmentStatus: { [Op.ne]: "CANCELLED" },
    },
    order: [["createdAt", "DESC"]],
  });

  if (!clientAppointmentsHistoryList) return res.status(404).json([]);

  res.json(clientAppointmentsHistoryList);
}

export {
  handleGetClientAppointmentHistory,
  handleGetClientAppointmentHistoryList,
};
