import bcrypt from "bcrypt";

async function hashPassword(password) {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
}

export default hashPassword;
