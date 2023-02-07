const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");

router.post("/", Middleware, (req, res) => {
  const db = admin.firestore();
  const usersCollection = db.collection("users");

  //Generate random user id
  const userId =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  //Hash password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);

  //Insert a new document into the collection
  usersCollection.doc(userId).set({
    username: req.body.username,
    fullName: req.body.fullName,
    email: req.body.email,
    password: hashedPassword,
    userId: userId,
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "User registered successfully",
  });
});

async function Middleware(req, res, next) {
  const db = admin.firestore();
  const usersCollection = db.collection("users");
  const user = await usersCollection.where("email", "==", req.body.email).get();
  if (!user.empty) {
    res.status(400).send({
      message: "User already exists",
    });
  }

  //Check if user exists
  // const phone = await usersCollection
  //   .where("phone", "==", req.body.phone)
  //   .get();
  // if (!phone.empty) {
  //   res.status(400).send({
  //     message: "User already exists",
  //   });
  // }

  //Check if user exists
  const username = await usersCollection.where("username", "==", req.body.username).get();
  if (!username.empty) {
    res.status(400).send({
      message: "User already exists",
    });
  }

  next();
} 
 
module.exports = router;
