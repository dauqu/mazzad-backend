const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const db = admin.firestore();
const auctionCollection = db.collection("auctions");

//Create Auction (POST)
router.post("/", (req, res) => {
  const token =
    req.cookies.token || req.headers["x-access-token"] || req.body.token;

  if (!token) {
    res.status(401).send({
      message: "No token provided",
    });
  }

  //Verify JWT token
  // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //     if (err) {
  //         return res.status(401).send({
  //             message: "Unauthorized",
  //         });
  //     }
  //     req.userId = decoded.id;
  // });

  //Create new auction
  auctionCollection.add({
    title: req.body.title,
    value: req.body.value,
    currency: req.body.currency,
    description: req.body.description,
    minimal_step: req.body.minimal_step,
    token: req.body.token,
    items: req.body.items,
    type: req.body.type,
    contract: req.body.contract,
    createdBy: "harsha",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Auction created successfully",
  });
});

//Get all Auctions (GET)
router.get("/", (req, res) => {
  auctionCollection
    .get()
    .then((data) => {
      let auctions = [];
      data.forEach((doc) => {
        auctions.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return res.status(200).json(auctions);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

//Get Auction by ID (GET)
router.get("/:id", (req, res) => {
  const auctionId = req.params.id;
  auctionCollection
    .doc(auctionId)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({
          error: "Auction not found",
        });
      }
      return res.status(200).json(doc.data());
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

//Update Auction (PUT)
router.put("/:id", (req, res) => {
  const auctionId = req.params.id;
  auctionCollection
    .doc(auctionId)
    .update({
      title: req.body.title,
      value: req.body.value,
      currency: req.body.currency,
      description: req.body.description,
      minimal_step: req.body.minimal_step,
      token: req.body.token,
      items: req.body.items,
      type: req.body.type,
      contract: req.body.contract,
      createdBy: req.body.createdBy,
      updatedAt: new Date().toISOString(),
    })
    .then(() => {
      return res.status(200).json({
        message: "Auction updated successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

//Delete Auction (DELETE)
router.delete("/:id", (req, res) => {
  const auctionId = req.params.id;
  auctionCollection
    .doc(auctionId)
    .delete()
    .then(() => {
      return res.status(200).json({
        message: "Auction deleted successfully",
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

module.exports = router;
