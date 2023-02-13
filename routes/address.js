const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();
const addressCollection = db.collection("address");

const VerifyToken = require("../functions/verify-token");

//Get all address
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

  //Get address by username
  const snapshot = await addressCollection
    .where("username", "==", username)
    .get();
  //Check if address exists
  if (snapshot.empty) {
    res.status(404).send({
      message: "No address found",
    });
  } else {
    snapshot.forEach((doc) => {
      res.json({
        id: doc.id,
        ...doc.data(),
      });
    });
  }
});

//Get a address
router.get("/:id", async (req, res) => {
  const address = await addressCollection.doc(req.params.id).get();
  if (!address.exists) {
    res.status(404).send({
      message: "Address not found",
    });
  } else {
    res.status(200).send({
      id: address.id,
      ...address.data(),
    });
  }
});

//Create a address
router.post("/", async (req, res) => {
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

  //Add new address to the collection
  const addedAddress = await addressCollection.add({
    ...req.body,
    createdBy: username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  //Send response
  res.status(200).send({
    message: "Address added successfully",
    address: {
      id: addedAddress.id,
      ...(await addedAddress.get()).data(),
    },
  });
});

//Update a address
router.put("/:id", async (req, res) => {
  try {
    const address = await addressCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Address not found",
      });
    } else {
      await addressCollection.doc(req.params.id).update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating address",
    });
  }
});

//Delete a address
router.delete("/:id", async (req, res) => {
  try {
    const address = await addressCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Address not found",
      });
    } else {
      await addressCollection.doc(req.params.id).delete();
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting address",
    });
  }
});

module.exports = router;
