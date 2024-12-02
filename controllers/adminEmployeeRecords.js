import { User } from "../models/index.models.js";
import hashPassword from "../utils/hashPassword.js";
import { v4 as uuidv4 } from "uuid";

function handleAdminEmployeeRecords(req, res) {
  res.render("adminEmployeeRecords", { adminName: req.user.fullName });
}

async function handleGetAdminEmployeesList(req, res) {
  const clientList = await User.findAll({
    attributes: ["id", "name", "fullName", "role", "email"],
    where: { role: "admin" },
  });

  res.json(clientList);
}

async function handlePostAddRecord(req, res) {
  const { recordUsername, recordPassword, recordName, recordEmail } = req.body;

  const existingUser = await User.findOne({ where: { name: recordUsername } });

  if (existingUser) {
    return res
      .status(409)
      .json({
        message: "There is already an existing account with that username.",
      });
  }

  const hashedPassword = await hashPassword(recordPassword);

  await User.create({
    id: uuidv4(),
    name: recordUsername,
    password: hashedPassword,
    fullName: recordName,
    email: recordEmail,
    role: "admin",
  });

  res.status(200).json({ message: "New record added" });
}

async function handlePostEditRecord(req, res) {
  const { editRecordId, newRecordName, newRecordEmail } = req.body;

  await User.update(
    { fullName: newRecordName, email: newRecordEmail },
    { where: { id: editRecordId } }
  );

  res.status(200).json({ message: "Record edited" });
}

async function handlePostDeleteRecord(req, res) {
  const { adminUserId } = req.body;

  await User.destroy({ where: { id: adminUserId } });

  res.status(200).json({ message: "Record deleted" });
}

export {
  handleAdminEmployeeRecords,
  handleGetAdminEmployeesList,
  handlePostAddRecord,
  handlePostEditRecord,
  handlePostDeleteRecord,
};
