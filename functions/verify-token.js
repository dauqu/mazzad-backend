const jwt = require("jsonwebtoken");

const VerifyToken = (token) => {
  try {
    const verified = jwt.verify(token, "Harsh@Singh8576");
    return verified;
  } catch (error) {
    return "Invalid token";
  }
};

module.exports = VerifyToken;
