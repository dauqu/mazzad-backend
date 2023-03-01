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
    res.json({
      message: "Profile not found",
      error: error.message,
    });
  }
});

// code to get profile of specific user by id
router.get("/:id", async (req, res) => {
  try {
    const doc = await profileCollection.doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).send({
        message: "Profile not found",
      });
    } else {
      res.json({
        id: doc.id,
        ...doc.data(),
      });
    }
  } catch (error) {
    res.json({
      message: "Profile not found",
      error: error.message,
    });
  }
});

module.exports = router;
