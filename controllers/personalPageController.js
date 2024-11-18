import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Notifications, User } from "../models/index.models.js";

dayjs.extend(relativeTime);

async function handlePersonalPage(req, res) {
  const userId = req.user.id;

  const userDetails = await User.findOne({
    attributes: [
      "id",
      "name",
      "fullName",
      "birthday",
      "email",
      "contactNumber",
      "gender",
      "role",
      "avatar",
      "password",
      "createdAt",
    ],
    where: { id: userId },
    raw: true,
  });

  const formattedAccountCreationDate = dayjs(userDetails.createdAt).format(
    "MMMM D, YYYY h:mm A"
  );

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

  res.render("personalPageClient", {
    ...userDetails,
    createdAt: formattedAccountCreationDate,
    dayjs,
    notifications: formattedNotifications,
  });
}

function handlePetPage(req, res) {
  return res.render("clientPetPage");
}

async function handleEditProfile(req, res) {
  const {
    profileFullName,
    profileBirthdate,
    profileEmail,
    profileContactNumber,
    profileGender,
  } = req.body;

  const userId = req.body.userId || req.user.id;

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
      isProfileComplete: true,
      avatar: existingAvatar.avatar.startsWith("/uploads")
        ? existingAvatar.avatar
        : avatarLink,
    },
    { where: { id: userId } }
  );

  req.user.fullName = profileFullName;
  req.user.birthday = profileBirthdate;
  req.user.email = profileEmail;
  req.user.contactNumber = profileContactNumber;
  req.user.gender = profileGender;

  res.status(200).json({ message: "Profile updated" });
}

async function handleIsProfileComplete(req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findOne({ where: { id: req.user.id }, raw: true });

  const isProfileComplete = user.isProfileComplete;

  return res.json({ isProfileComplete });
}

async function handleUpdateIsFirstTimeLogin(req, res) {
  const userId = req.user.id;

  await User.update({ isFirstTimeLogin: false }, { where: { id: userId } });

  res.json({ message: "Update success" });
}

export {
  handlePersonalPage,
  handlePetPage,
  handleEditProfile,
  handleIsProfileComplete,
  handleUpdateIsFirstTimeLogin,
};
