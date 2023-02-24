const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const walletRef = db.collection("wallet");
const jwt = require("jsonwebtoken");

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
    const token = req.headers["token"] || req.cookies.token;
    const {  amount } = req.body;
    try {

        if(!token) return res.status(401).json({
            message: "Unauthorized",
        });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }
        const wallet = await walletRef.where("userId", "==", id).limit(1).get();

        if (wallet.empty) {
            return res.status(400).send({
                message: "User does not exist",
            });
        }

        wallet.forEach((doc) => {
            const wallet = doc.data();
            const toupdateamount = wallet.amount + amount;
            walletRef.doc(doc.id).update({
                amount: toupdateamount,
            });
        });

        return res.json({
            id: wallet.id,
            ...(await wallet.get()).data(),
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});

    

module.exports = router;