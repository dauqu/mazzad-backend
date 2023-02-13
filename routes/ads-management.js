const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");

const db = admin.firestore();
const adsCollection = db.collection("advertisement");

const VerifyToken = require("../functions/verify-token");

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

  const username = verified.username;

  //Create new auction
  adsCollection.add({
    ...req.body,
    createdBy: username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Advertisement added successfully",
  });
});

//Get all Auctions (GET)
router.get("/", (req, res) => {
  adsCollection
    .get()
    .then((data) => {
      let ads = [];
      data.forEach((doc) => {
        ads.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return res.status(200).json(ads);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err.code,
      });
    });
});

//Get my ads (GET)
router.get("/my-ads", (req, res) => {
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

  adsCollection
    .where("createdBy", "==", username)
    .get()
    .then((data) => {
      let ads = [];
      data.forEach((doc) => {
        ads.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return res.status(200).json(ads);
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
  const adsId = req.params.id;
  adsCollection
    .doc(adsId)
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

//Delete Auction (DELETE)
router.delete("/:id", (req, res) => {
  const adsId = req.params.id;
  adsCollection
    .doc(adsId)
    .delete()
    .then(() => {
      return res.status(200).json({
        message: "Advertisement deleted successfully",
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
