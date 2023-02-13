const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();
const usersCollection = db.collection("users");

router.get("/", async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
