const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const auctionCollection = db.collection("auctions");

//Create Auction (POST)
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
  if (!verified) {
    return res.status(401).send({
      message: "Invalid token",
    });
  }

  const username = verified.username;
  if (!username) {
    return res.status(401).send({
      message: "Invalid Username",
    });
  }

  //Create new auction
  auctionCollection.add({
    title: req.body.title,
    description: req.body.description,
    type: req.body.type,
    value: req.body.value,
    minimal_step: req.body.minimal_step,
    currency: req.body.currency,
    items: req.body.items,
    contract: req.body.contract,
    createdBy: username,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Auction created successfully",
  });
});

router.get("/", (req, res) => {
  //Get all acutions (GET)
  auctionCollection
    .get()
    .then((data) => {
      //Check if auctions exist
      if (data.empty) {
        return res.status(404).json({
          message: "No auctions found",
        });
      } else {
        let auctions = [];
        data.forEach((doc) => {
          auctions.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return res.status(200).json(auctions);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

//Get all Auctions (GET)
router.get("/my-auctions", (req, res) => {
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

  //Get auctions by username
  auctionCollection
    .where("createdBy", "==", username)
    .get()
    .then((data) => {
      data.forEach((doc) => {
        return res.status(200).json({
          id: doc.id,
          ...doc.data(),
        });
      });
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
      const productRef = db.collection("products").doc(doc.data().items[0]);
      console.log(doc.data().items[0]);
      if (!doc.exists) {
        return res.status(404).json({
          error: "Auction not found",
        });
      }
      productRef.get().then((product) => {
        return res.status(200).json({
          id: doc.id,
          ...doc.data(),
          items: {
            id: product.id,
            name: product.data().name,
            description: product.data().description,
            video_thumbnail: product.data().video_thumbnail,
            slug: product.data().slug,
            createdAt: product.data().createdAt,
            video: product.data().video,
            sku: product.data().sku,
          }
        });
      });
    })
    .catch((err) => {
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
