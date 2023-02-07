const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

//Search products
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const productsCollection = db.collection("products");
    const products = await productsCollection.get();
    const productsArray = [];
    products.forEach((doc) => {
        productsArray.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            price: doc.data().price,
            category: doc.data().category,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(productsArray);
});

module.exports = router;