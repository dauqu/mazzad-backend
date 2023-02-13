const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const VerifyToken = require("../functions/verify-token");

// Get all bank accounts
router.get("/", async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection("bank-accounts").get();
    const bankAccounts = [];
    snapshot.forEach((doc) => {
      bankAccounts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//My accounts
router.get("/my-accounts", async (req, res) => {
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

  try {
    const snapshot = await admin
      .firestore()
      .collection("bank-accounts")
      .where("createdBy", "==", username)
      .get();
    const bankAccounts = [];
    snapshot.forEach((doc) => {
      bankAccounts.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.status(200).json(bankAccounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a bank account
router.get("/:id", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("bank-accounts")
      .doc(req.params.id)
      .get();
    if (!snapshot.exists) {
      res.status(404).send({
        message: "Bank account not found",
      });
    } else {
      res.status(200).send({
        id: snapshot.id,
        ...snapshot.data(),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a bank account
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

  try {
    const bankAccount = {
    
      createdBy: username,
    };
    const newBankAccount = await admin
      .firestore()
      .collection("bank-accounts")
      .add(bankAccount);

    res.status(201).send({
      id: newBankAccount.id,
      ...bankAccount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a bank account
router.put("/:id", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("bank-accounts")
      .doc(req.params.id)
      .get();
    if (!snapshot.exists) {
      res.status(404).send({
        message: "Bank account not found",
      });
    } else {
      const bankAccount = {
        name: req.body.name,
        balance: req.body.balance,
      };
      await admin
        .firestore()
        .collection("bank-accounts")
        .doc(req.params.id)
        .update(bankAccount);
      res.status(200).send({
        id: req.params.id,
        ...bankAccount,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a bank account
router.delete("/:id", async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection("bank-accounts")
      .doc(req.params.id)
      .get();
    if (!snapshot.exists) {
      res.status(404).send({
        message: "Bank account not found",
      });
    } else {
      await admin
        .firestore()
        .collection("bank-accounts")
        .doc(req.params.id)
        .delete();
      res.status(200).send({
        message: "Bank account deleted successfully",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
