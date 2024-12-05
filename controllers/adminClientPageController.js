import dayjs from "dayjs";
import { User, Notifications } from "../models/index.models.js";

async function handleAdminClientPage(req, res) {
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

  res.render("adminClientPage", {
    notifications: formattedNotifications,
    adminName: req.user.fullName,
  });
}

async function handleAdminClientPersonalPage(req, res) {
  const clientId = req.params.id;

  const userDetails = await User.findOne({
    where: { id: clientId },
    raw: true,
  });
  const formattedAccountCreationDate = dayjs(userDetails.createdAt).format(
    "MMMM D, YYYY h:mm A"
  );

  res.render("adminPersonalClientPage", {
    ...userDetails,
    createdAt: formattedAccountCreationDate,
    dayjs,
  });
}

async function handleAdminClientList(req, res) {
  const clientList = await User.findAll({
    attributes: ["id", "fullName", "email", "contactNumber"],
    where: { role: "client" },
  });

  res.json(clientList);
}

async function handleAdminEditClientProfile(req, res) {
  const {
    userId,
    profileFullName,
    profileBirthdate,
    profileEmail,
    profileContactNumber,
    profileGender,
  } = req.body;

  const existingAvatar = await User.findOne({
    attributes: ["avatar"],
    where: { id: userId },
    raw: true,
  });

  const avatarId =
    profileGender === "Male"
      ? Math.floor(Math.random() * 49) + 1
      : profileGender === "Female"
      ? Math.floor(Math.random() * 49) + 51
      : 0;

  const avatarLink =
    avatarId === 0
      ? "/images/profile-icon.png"
      : `https://avatar.iran.liara.run/public/${avatarId}`;

  await User.update(
    {
      fullName: profileFullName,
      birthday: profileBirthdate,
      email: profileEmail,
      contactNumber: profileContactNumber,
      gender: profileGender,
      avatar: existingAvatar.avatar.startsWith("/uploads")
        ? existingAvatar.avatar
        : avatarLink,
    },
    { where: { id: userId } }
  );

  res.status(200).json({ message: "Profile updated from Admin Side" });
}

export {
  handleAdminClientPage,
  handleAdminClientPersonalPage,
  handleAdminClientList,
  handleAdminEditClientProfile,
};
