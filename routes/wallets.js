const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const walletRef = db.collection("wallets");

//Get all documents JSON
router.get("/", async (req, res) => {
    try {

        const allWallets = await walletRef.get();
        const wallets = [];
        allWallets.forEach((doc) => {
            wallets.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        return res.json(wallets);
    } catch (error) {
        return res.json({
            message: error.message,
            error: error.code
        });
    }
});

//Get a document JSON
router.get("/:id", async (req, res) => {
    try {
        const wallet = await walletRef.doc(req.params.id).get();
        res.json({
            id: wallet.id,
            ...wallet.data(),
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});

// add amount to wallet
router.post("/add", async (req, res) => {
    try {
        const wallet = await walletRef.doc(req.body.id).get();
        const walletData = wallet.data();
        const newBalance = walletData.balance + req.body.amount;
        await walletRef.doc(req.body.id).update({
            balance: newBalance
        });
        res.json({
            id: wallet.id,
            ...wallet.data(),
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});