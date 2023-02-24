const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const bcrypt = require("bcryptjs");
const db = admin.firestore();



router.post("/", Middleware, async (req, res) => {
  try {
  const usersCollection = db.collection("users");
  const walletCollection = db.collection("wallet");

  //Generate random user id
  const userId =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);
  
  //Hash password
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  // create new wallet 
  let wallet = await walletCollection.add({
    userId: userId,
    amount: 0,
    createdAt: new Date().toISOString(),
  });
  
  //Insert a new document into the collection
  let addedUser = await usersCollection.add({
    ...req.body,
    fullName: req.body.fullName,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    userId: userId,
    role: "user",
    status: "active",
    createdAt: new Date().toISOString(),
    wallet_id: wallet.id,
  });

  //Send response
  res.status(200).json({
    message: "User registered successfully",
    user: {
      id: addedUser.id,
      ...(await addedUser.get()).data(),
    }
  });
} catch (error) {
 return res.status(500).json({
    message: "User registered successfully",
  });

}
});

async function Middleware(req, res, next) {
  //Check all fields are filled
  if (
    !req.body.fullName ||
    !req.body.username ||
    !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send({
      message: "All fields are required",
    });
  }

  const db = admin.firestore();
  const usersCollection = db.collection("users");
  const user = await usersCollection.where("email", "==", req.body.email).get();
  if (!user.empty) {
    return res.status(400).send({
      message: "User already exists",
    });
  }

  //Check if user exists
  const username = await usersCollection
    .where("username", "==", req.body.username)
    .get();
  if (!username.empty) {
    return res.status(400).send({
      message: "User already exists",
    });
  }

  //CHeck if email is valid
  if (!req.body.email.includes("@")) {
    return res.status(400).send({
      message: "Invalid email",
    });
  }

  //Check if password is valid
  if (req.body.password.length < 6) {
    return res.status(400).send({
      message: "Password must be at least 6 characters",
    });
  }

  //Check emails is already exists
  const email = await usersCollection
    .where("email", "==", req.body.email)
    .get();
  if (!email.empty) {
    return res.status(400).send({
      message: "Email already exists",
    });
  }

  next();
}

module.exports = router;
