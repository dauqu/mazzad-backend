const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

const VerifyToken = require("../functions/verify-token");

const db = admin.firestore();
const auctionCollection = db.collection("auctions");
const productCollection = db.collection("products");

//Create Auction (POST)
router.post("/", (req, res) => {
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
    if (!verified) {
        return res.status(401).send({
            message: "Invalid token",
        });
    }

    const username = verified.username;
    if (!username) {
        return res.status(401).send({
            message: "Invalid Username",
        });
    }

    //Check all fields are filled
    if (
        req.body.title === "" ||
        req.body.description === "" ||
        req.body.type === "" ||
        req.body.value === "" ||
        req.body.minimal_step === "" ||
        req.body.currency === "" ||
        req.body.items === "" ||
        req.body.contract === "" ||
        req.body.start_date === "" ||
        req.body.end_date === ""
    ) {
        return res.status(400).send({
            message: "All fields are required",
        });
    }

    //Create new auction
    auctionCollection.add({
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        value: req.body.value,
        minimal_step: req.body.minimal_step,
        currency: req.body.currency,
        items: req.body.items,
        productsref: `products/${req.body.items}`,
        contract: req.body.contract,
        createdBy: username,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: req.body.status || "active"
    });

    //Send response
    res.status(200).send({
        message: "Auction created successfully",
    });
});

router.get("/", async (req, res) => {
    try {
        const resauctions = [];
        const auctionsSnapshot = await auctionCollection.get();

        if (auctionsSnapshot.empty) {
            return res.status(404).json({ message: "No auctions found" });
        }

        const productPromises = auctionsSnapshot.docs.map(async (auctionDoc) => {
            const productRef = db.collection("products").doc(auctionDoc.data().items);
            const productDoc = await productRef.get();
            const productData = productDoc.data();
            const auctionData = auctionDoc.data();

            resauctions.push({
                id: auctionDoc.id,
                ...auctionData,
                items: {
                    id: productDoc.id,
                    name: productData.name,
                    description: productData.description,
                    video_thumbnail: productData.video_thumbnail,
                    slug: productData.slug,
                    createdAt: productData.createdAt,
                    video: productData.video,
                    sku: productData.sku,
                },
            });
        });

        await Promise.all(productPromises);

        return res.status(200).json(resauctions);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.code });
    }
});


//Get all Auctions (GET)
router.get("/my-auctions", async (req, res) => {
    try {


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

        //Get auctions by username
        const auctionSnap = await auctionCollection
            .where("createdBy", "==", username)
            .get()

        let auctions = [];


        auctionSnap
            .forEach(async (doc) => {
                const product = await productsCollection
                    .doc(doc.data().items).get();
                let auction = {
                    id: doc.id,
                    ...doc.data(),
                    items: {
                        id: product.id,
                        ...product.data()
                    }
                }
                auctions.push(auction);
            });

        return res.status(200).json(auctions);
    } catch (error) {
        return res.status(200).json({
            error: error.code,
            message: error.message
        });
    }
});

//Get Auction by ID (GET)
router.get("/:id", (req, res) => {
    const auctionId = req.params.id;

    auctionCollection
        .doc(auctionId)
        .get()
        .then((doc) => {
            const productRef = db.collection("products").doc(doc.data().items);
            console.log(doc.data().items[0]);
            if (!doc.exists) {
                return res.status(404).json({
                    error: "Auction not found",
                });
            }
            productRef.get().then((product) => {
                return res.status(200).json({
                    id: doc.id,
                    ...doc.data(),
                    items: {
                        id: product.id,
                        name: product.data().name,
                        description: product.data().description,
                        video_thumbnail: product.data().video_thumbnail,
                        slug: product.data().slug,
                        createdAt: product.data().createdAt,
                        video: product.data().video,
                        sku: product.data().sku,
                    }
                });
            });
        })
        .catch((err) => {
            return res.status(500).json({
                error: err.code,
            });
        });
});

//Update Auction (PUT)
router.put("/:id", (req, res) => {
    const auctionId = req.params.id;
    auctionCollection
        .doc(auctionId)
        .update({
            title: req.body.title,
            value: req.body.value,
            currency: req.body.currency,
            description: req.body.description,
            minimal_step: req.body.minimal_step,
            token: req.body.token,
            items: req.body.items,
            type: req.body.type,
            contract: req.body.contract,
            createdBy: req.body.createdBy,
            updatedAt: new Date().toISOString(),
        })
        .then(() => {
            return res.status(200).json({
                message: "Auction updated successfully",
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err.code,
            });
        });
});

//Delete Auction (DELETE)
router.delete("/:id", (req, res) => {
    const auctionId = req.params.id;
    auctionCollection
        .doc(auctionId)
        .delete()
        .then(() => {
            return res.status(200).json({
                message: "Auction deleted successfully",
            });
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).json({
                error: err.code,
            });
        });
});


// get actions by status 
router.get("/status/:status", async (req, res) => {
    try {
        const status = req.params.status;
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

        let auctiondata = auctionCollection
            .where("createdBy", "==", username)

        auctiondata = await auctiondata.where("status", "==", status)
            .get()

        let auctions = [];
        auctiondata.forEach((doc) => {
            auctions.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return res.status(200).json({
            auctions,
            message: "Auctions found"
        });


    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });

    }
});

module.exports = router;
