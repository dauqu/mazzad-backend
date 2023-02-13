const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();

//Read all rate
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const rateCollection = db.collection("rate");
  const rate = await rateCollection.get();
  const rateArray = [];
  rate.forEach((doc) => {
    rateArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(rateArray);
});

//Read a rate
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const rateCollection = db.collection("rate");
  const rate = await rateCollection.doc(req.params.id).get();
  if (!rate.exists) {
    res.status(404).send({
      message: "Rate not found",
    });
  } else {
    res.status(200).send({
      id: rate.id,
      ...rate.data(),
    });
  }
});

//Update a rate
router.put("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const rateCollection = db.collection("rate");
    const rate = await rateCollection.doc(req.params.id).get();
    if (!rate.exists) {
      res.status(404).send({
        message: "Rate not found",
      });
    } else {
      await rateCollection.doc(req.params.id).update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating rate",
    });
  }
});

//Delete a rate
router.delete("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const rateCollection = db.collection("rate");
    const rate = await rateCollection.doc(req.params.id).get();
    if (!rate.exists) {
      res.status(404).send({
        message: "Rate not found",
      });
    } else {
      await rateCollection.doc(req.params.id).delete();
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting rate",
    });
  }
});

module.exports = router;
