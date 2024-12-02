import { User } from "../models/index.models.js";
import hashPassword from "../utils/hashPassword.js";
import { v4 as uuidv4 } from "uuid";

function handleAdminEmployeeRecords(req, res) {
  res.render("adminEmployeeRecords", { adminName: req.user.fullName });
}

async function handleGetAdminEmployeesList(req, res) {
  const clientList = await User.findAll({
    attributes: ["id", "fullName", "role", "email", "contactNumber"],
    where: { role: "admin" },
  });

  res.json(clientList);
}

async function handlePostAddRecord(req, res) {
  const { recordUsername, recordPassword, recordName, recordEmail } = req.body;

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

export {
  handleAdminEmployeeRecords,
  handleGetAdminEmployeesList,
  handlePostAddRecord,
};
