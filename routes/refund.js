const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();


router.get("/", async (req, res) => {
    try {

        const snapshot = await db.collection("refund").get();
        const data = [];
        snapshot.forEach((doc) => {
            data.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        res.json(data);
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const snapshot = await db.collection("refund").doc(req.params.id).get();
        res.json({ message: "success", refund: { id: req.params.id, ...snapshot.data() } });
    } catch (error) {
        res.json({ message: error.message });
    }
});


router.post("/", async (req, res) => {
    try {
        const snapshot = await db.collection("refund").add({
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()

        });
        res.json({ message: "success", refund: { id: snapshot.id, ...(await snapshot.get()).data() } });
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const snapshot = await db.collection("refund").doc(req.params.id).update({
            ...req.body,
            updatedAt: new Date().toISOString()
        });
        res.json({ message: "success", refund: { id: req.params.id, ...(await snapshot.get()).data() } });
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        await db.collection("refund").doc(req.params.id).delete();
        res.json({ message: "success" });
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;