import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "campusfix_jwt_secret_key_2026_rgukt", {
    expiresIn: "7d",
  });
};

export default generateToken;
