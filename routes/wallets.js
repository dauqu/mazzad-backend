const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();

db.settings({ ignoreUndefinedProperties: true });

const walletRef = db.collection("wallet");
const transactionRef = db.collection("transactions");

const { getAuthUser } = require("../functions/getauth");

//Get all wallet 
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

//Get a wallet by id
router.get("/my", getAuthUser, async (req, res) => {
    const { transactionLimit } = req.query;

    try {
        const user = req.user;

        const wallet = await walletRef.doc(user.wallet_id).get();
        let transaction = transactionRef.where("user", "==", user.id);
        transaction = await transaction.where("type", "==", "wallet").get()
        

        let transactions = [];
        transaction.forEach((doc) => {
            transactions.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        // sort transaction by date
        transactions = transactions.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        // limit transaction
        if (transactionLimit) {
            transactions = transactions.slice(0, transactionLimit);
        }

        return res.json({
            wallet: {
                id: wallet.id,
                ...wallet.data(),
            },
            user: user,
            transactions: transactions,
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});

// add amount to wallet
router.post("/add", getAuthUser, async (req, res) => {

    const { amount } = req.body;
    try {
        const user = req.user;
        if (isNaN(amount)) {
            return res.status(400).send({
                message: "amount must be a number",
            });
        }
        if (Number(amount) <= 0) {
            return res.status(400).send({
                message: "amount must be a positive number",
            });
        }

        const wallet = await walletRef.doc(user.wallet_id).get();
        const walletdata = wallet.data();

        const toupdateamount = Number(walletdata.amount) + Number(amount);

        await walletRef.doc(user.wallet_id).update({
            ...walletdata,
            amount: String(toupdateamount),
            updatedAt: new Date().toISOString(),
        });

        transactionRef.add({
            title: "Amount added.",
            amount: amount,
            description: req.body.description || `${amount} RS. added in wallet`,
            type: "wallet",
            action: "add",
            user: user.id,
            createdAt: new Date().toISOString(),
        });

        return res.json({
            id: wallet.id,
            ...(await walletRef.doc(user.wallet_id).get()).data(),
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});

//delete wallet by id
router.delete("/:id", async (req, res) => {
    try {
        const wallet = await walletRef.doc(req.params.id).get()
        if (!wallet.exists) {
            return res.status(404).send({
                message: "Wallet does not exist",
            });
        }
        await walletRef.doc(req.params.id).delete();
        res.json({
            message: "Wallet deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});

// withdrawing amount from wallet
router.post("/withdraw", getAuthUser, async (req, res) => {
    const { amount } = req.body;
    try {
        const user = req.user;
        if (isNaN(amount)) {
            return res.status(400).send({
                message: "amount must be a number",
            });
        }
        if (Number(amount) <= 0) {
            return res.status(400).send({
                message: "amount must be a positive number",
            });
        }

        const wallet = await walletRef.doc(user.wallet_id).get();
        const walletdata = wallet.data();

        const toupdateamount = Number(walletdata.amount) - Number(amount);
        if (toupdateamount < 0) {
            return res.status(400).send({
                message: "You don't have enough amount in your wallet",
            });
        }

        await walletRef.doc(user.wallet_id).update({
            ...walletdata,
            amount: String(toupdateamount),
            updatedAt: new Date().toISOString(),
        });

        transactionRef.add({
            title: "Amount debited from wallet",
            amount: amount,
            description: `${amount} RS. debited from wallet`,
            type: "wallet",
            action: "withdraw",
            user: user.id,
            createdAt: new Date().toISOString(),
        });

        return res.json({
            id: wallet.id,
            ...(await walletRef.doc(user.wallet_id).get()).data(),
        });
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error: error.code
        });
    }
});



module.exports = router;