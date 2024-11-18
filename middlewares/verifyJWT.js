import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded) => {
    if (error) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.user = decoded.userId;
    next();
  });
}

export default verifyJWT;
