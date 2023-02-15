const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const bidsCollection = db.collection("bids");

router.post("/", (req, res) => {
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
    //Add new bid to the collection
    bidsCollection.add({
      auctionId: req.body.auctionId,
      amount: req.body.amount,
      description: req.body.description,
      currency: req.body.currency,
      createdBy: username,
      createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).json({
      message: "Bid added successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Read all bids
router.get("/", async (req, res) => {
  try {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bids = await bidsCollection.get();

    const bidsArray = [];
    bids.forEach((doc) => {
      bidsArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(bidsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get my bids
router.get("/mybids", async (req, res) => {
  //Get token from header
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
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bids = await bidsCollection.where("createdBy", "==", username).get();

    const bidsArray = [];
    bids.forEach((doc) => {
      bidsArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(bidsArray);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Read a bid
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const bidsCollection = db.collection("bids");
  const bid = await bidsCollection.doc(req.params.id).get();
  if (!bid.exists) {
    res.status(404).send({
      message: "Bid not found",
    });
  } else {
    res.status(200).send({
      id: bid.id,
      ...bid.data(),
    });
  }
});

//Update a bid
router.put("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
      res.status(404).send({
        message: "Bid not found",
      });
    } else {
      await bidsCollection.doc(req.params.id).update({
        ...req.body,
      });
      res.status(200).json({
        message: "Bid updated successfully",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

//Delete a bid
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const bidsCollection = db.collection("bids");
  const bid = await bidsCollection.doc(req.params.id).get();
  if (!bid.exists) {
    res.status(404).send({
      message: "Bid not found",
    });
  } else {
    await bidsCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Bid deleted successfully",
    });
  }
});

module.exports = router;
