const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const profileCollection = db.collection("users");

//Read all profiles
router.get("/", async (req, res) => {
  //Get token from header
  const token =
    req.body.token || req.cookies.token || req.headers["x-access-token"];

  //Return if no token
  if (!token) {
    res.status(401).send({
      message: "No token provided",
    });
  }

  //Check if no token
  const verified = VerifyToken(token);

  const username = verified.username;

  try {
    const snapshot = await profileCollection
      .where("username", "==", username)
      .get();
    snapshot.forEach((doc) => {
      res.json({
        id: doc.id,
        ...doc.data(),
      });
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
