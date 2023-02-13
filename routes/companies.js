const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const slugify = require("slugify");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const companiesCollection = db.collection("companies");

//Get all address
router.get("/", async (req, res) => {
  const companies = await companiesCollection.get();
  const companiesArray = []; 
  companies.forEach((doc) => {
    companiesArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(companiesArray);
});

//Get a address
router.get("/:id", async (req, res) => {
  const companies = await companiesCollection.doc(req.params.id).get();
  if (!companies.exists) {
    res.status(404).send({
      message: "Company not found",
    });
  } else {
    res.status(200).send({
      id: companies.id,
      ...companies.data(),
    });
  }
});

//My companies
router.get("/my-companies", async (req, res) => {
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
  const snapshot = await companiesCollection
    .where("createdBy", "==", username)
    .get();
  //Check if address exists
  if (snapshot.empty) {
    res.status(404).send({
      message: "No companies found",
    });
  } else {
    const companiesArray = [];
    snapshot.forEach((doc) => {
      companiesArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).send(companiesArray);
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
  const addedAddress = await companiesCollection.add({
    ...req.body,
    createdBy: username,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  //Send response
  res.status(200).send({
    message: "Company added successfully",
    address: {
      id: addedAddress.id,
      ...(await addedAddress.get()).data(),
    },
  });
});

//Update a address
router.put("/:id", async (req, res) => {
  try {
    const address = await companiesCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Company not found",
      });
    } else {
      await companiesCollection.doc(req.params.id).update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating company",
    });
  }
});

//Delete a address
router.delete("/:id", async (req, res) => {
  try {
    const address = await companiesCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Company not found",
      });
    } else {
      await companiesCollection.doc(req.params.id).delete();
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting company",
    });
  }
});

module.exports = router;
