const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const SendMail = require("../functions/smtp");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const bidsCollection = db.collection("bids");

router.post("/", (req, res) => {
  var subject = "New Bid on your auction";
  // code for bid notification email template
  var html = `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">123 AUC</a>
    </div>
    <p style="font-size:1.1em">Hi, ${req.body.username} </p>
    <p>There is a new bid on your Auction_id (${req.body.auctionId}) . The amount of bid is (${req.body.amount})</p>
    <p>This bid is created   ${req.body.createdAt}</p>
    <p>We are wishing you good luck for this . </p>
    <p style="font-size:0.9em;">Regards,<br />123 AUC</p>
    <hr style="border:none;border-top:1px solid #eee" />

  </div>
</div>`;
  var email = "info@dauqu.com";
  //Send email
  SendMail(email, subject, html);
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
  if (!username || username == "") {
    res.status(401).send({
      message: "No token provided",
    });
  }

  try {
    //Add new bid to the collection
    bidsCollection.add({
      createdAt: new Date().toISOString(),
      auctionId: req.body.auctionId,
      amount: req.body.amount,
      description: req.body.description,
      currency: req.body.currency,
      createdBy: username,
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

//Read all bids for an auction
router.get("/auction/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bids = await bidsCollection
      .where("auctionId", "==", req.params.id)
      .get();

    const bidsArray = [];
    let highest_bid = 0;
    bids.forEach((doc) => {
      if (Number(doc.data().amount) > Number(highest_bid)) {
        highest_bid = Number(doc.data().amount);
      }
      bidsArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json({
      bids: bidsArray,
      highest_bid: highest_bid,
    });
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
