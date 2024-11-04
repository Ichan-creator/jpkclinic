import { User } from "../models/index.models.js";

function handleAdminEmployeeRecords(req, res) {
  res.render("adminEmployeeRecords");
}

async function handleGetAdminEmployeesList(req, res) {
  const clientList = await User.findAll({
    attributes: ["id", "fullName", "role", "email", "contactNumber"],
    where: { role: "admin" },
  });

  res.json(clientList);
}

export { handleAdminEmployeeRecords, handleGetAdminEmployeesList };
