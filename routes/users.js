const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore();
const usersCollection = db.collection("users");

router.get("/", async (req, res) => {
  try {
    const snapshot = await usersCollection.get();
    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

router.get("/:blacklist", async (req, res) => {
  try {
    const snapshot = await usersCollection
      .where("status", "==", "blacklist")
      .get();

    const data = [];
    snapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(data);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


router.get("/id/:id", async (req, res) => {
  const { id }= req.params;
  try {
    const snapshot = await usersCollection
    .doc(id)
      .get();


    res.json({
      message: "User fetched successfully",
      user: {
        id: snapshot.id,
        ...snapshot.data(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await usersCollection.doc(id).update({
      ...req.body,
    });
    res.json({
      message: "User updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await usersCollection.doc(id).delete();
    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// block user 
router.put("/block/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await usersCollection.doc(id).update({
      status: "blacklist",
    });
    res.json({
      message: "User blocked successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});


  // unblock user 
  router.put("/unblock/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await usersCollection.doc(id).update({
        status: "active",
      });
      res.json({
        message: "User blocked successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });



  module.exports = router;
