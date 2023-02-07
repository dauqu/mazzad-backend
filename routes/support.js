const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
    const db = admin.firestore();
    const supportCollection = db.collection("support");

    //Add new support to the collection
    supportCollection.add({
        name: req.body.name,
        description: req.body.description,
        createdAt: new Date().toISOString(),
    });

    //Send response
    res.status(200).send({
        message: "Support added successfully",
    });
});

//Read all supports
router.get("/", async (req, res) => {
    const db = admin.firestore();
    const supportCollection = db.collection("support");
    const support = await supportCollection.get();
    const supportArray = [];

    support.forEach((doc) => {
        supportArray.push({
            id: doc.id,
            name: doc.data().name,
            description: doc.data().description,
            createdAt: doc.data().createdAt,
        });
    });
    res.status(200).send(supportArray);
});

//Read a support
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const supportCollection = db.collection("support");
    const support = await supportCollection.doc(req.params.id).get();
    if (!support.exists) {
        res.status(404).send({
            message: "Support not found",
        });
    } else {
        res.status(200).send({
            id: support.id,
            name: support.data().name,
            description: support.data().description,
            createdAt: support.data().createdAt,
        });
    }
});

//Update a support
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const supportCollection = db.collection("support");
    const support = await supportCollection.doc(req.params.id).get();
    if (!support.exists) {
        res.status(404).send({
            message: "Support not found",
        });
    } else {
        await supportCollection.doc(req.params.id).update({
            name: req.body.name,
            description: req.body.description,
        });
        res.status(200).send({
            message: "Support updated successfully",
        });
    }
});

//Delete a support
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const supportCollection = db.collection("support");
    const support = await supportCollection.doc(req.params.id).get();
    if (!support.exists) {
        res.status(404).send({
            message: "Support not found",
        });
    } else {
        await supportCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Support deleted successfully",
        });
    }
});

module.exports = router;