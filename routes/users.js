const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.get("/", async (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("users");

  try {
    const response = await usersCollection.get();
    const users = response.docs.map((doc) => doc.data());
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
