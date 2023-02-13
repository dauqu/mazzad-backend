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
    fullName: req.body.fullName,
    logo: req.body.logo,
    description: req.body.description,
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    country: req.body.country,
    google_map: req.body.google_map,
    password: hashedPassword,
    userId: userId,
    role: "user",
    createdAt: new Date().toISOString(),
  });

  //Send response
  res.status(200).send({
    message: "User registered successfully",
  });
});

async function Middleware(req, res, next) {
  //Check all fields are filled
  if (
    !req.body.fullName ||
    !req.body.logo ||
    !req.body.username ||
    !req.body.email ||
    !req.body.phone ||
    !req.body.country ||
    !req.body.google_map ||
    !req.body.password
  ) {
    res.status(400).send({
      message: "All fields are required",
    });
  }

  const db = admin.firestore();
  const usersCollection = db.collection("users");
  const user = await usersCollection.where("email", "==", req.body.email).get();
  if (!user.empty) {
    res.status(400).send({
      message: "User already exists",
    });
  }

  //Check if user exists
  const phone = await usersCollection
    .where("phone", "==", req.body.phone)
    .get();
  if (!phone.empty) {
    res.status(400).send({
      message: "User already exists",
    });
  }

  //Check if user exists
  const username = await usersCollection
    .where("username", "==", req.body.username)
    .get();
  if (!username.empty) {
    res.status(400).send({
      message: "User already exists",
    });
  }

  //CHeck if email is valid
  if (!req.body.email.includes("@")) {
    res.status(400).send({
      message: "Invalid email",
    });
  }

  //Check if password is valid
  if (req.body.password.length < 6) {
    res.status(400).send({
      message: "Password must be at least 6 characters",
    });
  }

  //Check emails is already exists
  const email = await usersCollection
    .where("email", "==", req.body.email)
    .get();
  if (!email.empty) {
    res.status(400).send({
      message: "Email already exists",
    });
  }

  next();
}

module.exports = router;
