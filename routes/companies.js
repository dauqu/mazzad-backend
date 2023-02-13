const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const slugify = require("slugify");

//Get all address
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const addressCollection = db.collection("company");
  const address = await addressCollection.get();
  const addressArray = [];
  address.forEach((doc) => {
    addressArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(addressArray);
});

//Get a address
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const addressCollection = db.collection("company");
  const address = await addressCollection.doc(req.params.id).get();
  if (!address.exists) {
    res.status(404).send({
      message: "Company not found",
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
  const db = admin.firestore();
  const addressCollection = db.collection("company");

  //Add new address to the collection
  const addedAddress = await addressCollection.add({
    ...req.body,
    createdBy: "harsha",
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
    const db = admin.firestore();
    const addressCollection = db.collection("company");
    const address = await addressCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Company not found",
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
      message: "Error updating company",
    });
  }
});

//Delete a address
router.delete("/:id", async (req, res) => {
  try {
    const db = admin.firestore();
    const addressCollection = db.collection("company");
    const address = await addressCollection.doc(req.params.id).get();
    if (!address.exists) {
      res.status(404).send({
        message: "Company not found",
      });
    } else {
      await addressCollection.doc(req.params.id).delete();
      res.status(200).json({});
    }
  } catch (error) {
    res.status(500).send({
      message: "Error deleting company",
    });
  }
});


module.exports = router;