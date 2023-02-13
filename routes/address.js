const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const slugify = require("slugify");

//Get all address
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const addressCollection = db.collection("address");
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
    const addressCollection = db.collection("address");
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
} );

