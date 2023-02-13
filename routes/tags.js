const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("tags");

  //Add new category to the collection
  const addedTag = await categoriesCollection.add({
    name: req.body.name,
    description: req.body.description,
    createdBy: "harsha",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  //Send response
  res.status(200).send({
    message: "Tag added successfully",
    tag: {
      id: addedTag.id,
      ...(await addedTag.get()).data(),
    }

  });
});

//Read all categories
router.get("/", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("tags");
  const categories = await categoriesCollection.get();
  const categoriesArray = [];
  categories.forEach((doc) => {
    categoriesArray.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  res.status(200).send(categoriesArray);
});

//Read a category
router.get("/:id", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("tags");
  const category = await categoriesCollection.doc(req.params.id).get();
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


    const db = admin.firestore();
    const categoriesCollection = db.collection("tags");
    const category = await categoriesCollection.doc(req.params.id).get();
    if (!category.exists) {
      res.status(404).send({
        message: "Tag not found",
      });
    } else {
      await categoriesCollection.doc(req.params.id).update({
        ...req.body,
        updatedAt: new Date().toISOString(),
      });
      res.status(200).json({
        message: "Tag updated successfully",
        tag: {
          id: category.id,
          ...(await categoriesCollection.doc(req.params.id).get()).data(),
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

//Delete a category
router.delete("/:id", async (req, res) => {
  const db = admin.firestore();
  const categoriesCollection = db.collection("tags");
  const category = await categoriesCollection.doc(req.params.id).get();
  if (!category.exists) {
    res.status(404).send({
      message: "Tag not found",
    });
  } else {
    await categoriesCollection.doc(req.params.id).delete();
    res.status(200).send({
      message: "Tag deleted successfully",
    });
  }
});

module.exports = router;
