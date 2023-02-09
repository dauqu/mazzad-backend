const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

router.post("/", (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    try {
        //Add new bid to the collection
        bidsCollection.add({
            title: req.body.title,
            value: req.body.value,
            description: req.body.description,
            currency: req.body.currency,
            minimal_step: req.body.minimal_step,
            token: req.body.token,
            createdAt: new Date().toISOString(),
            items: req.body.items,
            contract: req.body.contract
        });

        //Send response
        res.status(200).json({
            message: "Bid added successfully",

        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });

    }
});

//Read all bids
router.get("/", async (req, res) => {
    try {

        const db = admin.firestore();
        const bidsCollection = db.collection("bids");
        const bids = await bidsCollection.get()

        const bidsArray = bids.docs.map(doc => doc.data());
        // bids.forEach((doc) => {
        //     bidsArray.push({
        //         id: doc.id,
        //         ...doc.data(),
        //     });
        // });
        res.status(200).json(bidsArray);
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
});

//Read a bid
router.get("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        res.status(200).send({
            id: bid.id,
            title: doc.data().name,
            value: doc.data().name,
            description: doc.data().description,
            currency: doc.data().currency,
            minimal_step: doc.data().minimal_step,
            token: doc.data().token,
            createdAt: doc.data().createdAt,
            items: doc.data().items,
            contract: doc.data().contract
        });
    }
});

//Update a bid
router.put("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        await bidsCollection.doc(req.params.id).update({
            title: req.body.name,
            value: req.body.name,
            description: req.body.description,
            currency: req.body.currency,
            minimal_step: req.body.minimal_step,
            token: req.body.token,
            createdAt: req.body.createdAt,
            items: req.body.items,
            contract: req.body.contract
        });
        res.status(200).send({
            message: "Bid updated successfully",
        });
    }
});

//Delete a bid
router.delete("/:id", async (req, res) => {
    const db = admin.firestore();
    const bidsCollection = db.collection("bids");
    const bid = await bidsCollection.doc(req.params.id).get();
    if (!bid.exists) {
        res.status(404).send({
            message: "Bid not found",
        });
    } else {
        await bidsCollection.doc(req.params.id).delete();
        res.status(200).send({
            message: "Bid deleted successfully",
        });
    }
});


module.exports = router;