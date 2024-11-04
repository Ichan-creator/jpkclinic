import bcrypt from "bcrypt";

async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export default comparePassword;
