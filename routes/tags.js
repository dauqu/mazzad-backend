const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const tagsCollection = db.collection("tags");

router.post("/", async (req, res) => {
  try {
    //Get token from header

    const token =
      req.body.token || req.cookies.token || req.headers["x-access-token"];

    //Return if no token
    if (!token) {
      return res.status(401).send({
        message: "No token provided",
      });
    }

    //Check if no token
    const verified = VerifyToken(token);

    const username = verified.username;

    //Add new category to the collection
    const addedTag = await tagsCollection.add({
      name: req.body.name,
      description: req.body.description,
      createdBy: username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    //Send response
    return res.status(200).send({
      message: "Tag added successfully",
      tag: {
        id: addedTag.id,
        ...(await addedTag.get()).data(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

//Read all categories
router.get("/", async (req, res) => {
  const tags = await tagsCollection.get();
  let alltags = [];
  tags.forEach((doc) => {
    alltags.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).json(alltags);
});

//Get my tags
router.get("/mytags", async (req, res) => {
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

  tagsCollection
    .where("createdBy", "==", username)
    .get()
    .then((querySnapshot) => {
      let mytags = [];
      querySnapshot.forEach((doc) => {
        mytags.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.status(200).json(mytags);
    });
});

//Read a category
router.get("/:id", async (req, res) => {
  const category = await tagsCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Tag not found",
    });
  } else {
    res.status(200).send({
      id: category.id,
      ...category.data(),
    });
  }
});

//Update a category
router.put("/:id", async (req, res) => {
  try {
    const category = await tagsCollection.doc(req.params.id).get();
    if (!category.exists) {
      res.status(404).send({
        message: "Tag not found",
      });
    } else {
      await tagsCollection.doc(req.params.id).update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      res.status(200).json({
        message: "Tag updated successfully",
        tag: {
          id: category.id,
          ...(await tagsCollection.doc(req.params.id).get()).data(),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

//Delete a category
router.delete("/:id", async (req, res) => {
  const category = await tagsCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Tag not found",
    });
  } else {
    await tagsCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Tag deleted successfully",
    });
  }
});

module.exports = router;
