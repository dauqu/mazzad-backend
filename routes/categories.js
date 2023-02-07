const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
    const db = admin.firestore();
    const categoriesCollection = db.collection("categories");

    //Add new category to the collection
    categoriesCollection.add({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });
    //Send response
    res.status(200).send({
        message: "Category added successfully",
    });
});

//Read all categories
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const categoriesCollection = db.collection("categories");
    const categories = await categoriesCollection.get();
    const categoriesArray = [];
    categories.forEach((doc) => {
        categoriesArray.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(categoriesArray);
});

//Read a category
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const categoriesCollection = db.collection("categories");
    const category = await categoriesCollection.doc(req.params.id).get();
    if (!category.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    } else {
        res.status(200).send({
            id: category.id,
            name: category.data().name,
            description: category.data().description,
            createdAt: category.data().createdAt,
        });
    }
}); 

//Update a category
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const categoriesCollection = db.collection("categories");
    const category = await categoriesCollection.doc(req.params.id).get();
    if (!category.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    } else {
        await categoriesCollection.doc(req.params.id).update({
            name: req.body.name,
            description: req.body.description,
        });
        res.status(200).send({
            message: "Category updated successfully",
        });
    }
});

//Delete a category
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const categoriesCollection = db.collection("categories");
    const category = await categoriesCollection.doc(req.params.id).get();
    if (!category.exists) {
        res.status(404).send({
            message: "Category not found",
        });
    } else {
        await categoriesCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Category deleted successfully",
        });
    }
});

module.exports = router;