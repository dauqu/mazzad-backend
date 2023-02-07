const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.get("/", async (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("cart");

  try {
    const response = await usersCollection.get();
    const users = response.docs.map((doc) => doc.data());
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

//Create cart
router.post("/", async (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("cart");

  //Generate random user id
  const userId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Insert a new document into the collection
  usersCollection.doc(userId).set({
    cartId: userId,
    cartName: req.body.cartName,
    cartPrice: req.body.cartPrice,
    cartImage: req.body.cartImage,
    cartQuantity: req.body.cartQuantity,
    cartCreatedAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "Cart created successfully",
  });
});

module.exports = router;
