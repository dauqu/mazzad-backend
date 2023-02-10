const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const slugify = require("slugify");

router.get("/", async (req, res) => {
    try {
        const snapshot = await db.collection("contract").get();
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
        const snapshot = await db.collection("contract").doc(req.params.id).get();
        if (!snapshot.exists) {
            res.json({ message: "not found" });
            return;
        }
        res.json({ message: "success", contract: { id: req.params.id, ...snapshot.data() } });
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    try {
        let cid = slugify(req.body.title)+"-"+Date.now();
        const snapshot = await db.collection("contract").add({
            title: req.body.title,
            contract_id: cid,
            terms: req.body.terms,
            local_ship_terms: {
                price: req.body.local_ship_terms.price,
                days: req.body.local_ship_terms.days
            },
            international_ship_terms: {
                price: req.body.international_ship_terms.price,
                days: req.body.international_ship_terms.days
            },
            return_terms: req.body.return_terms,
            signature_profile: req.body.signature_profile,
            stamp_profile: req.body.stamp_profile, 
            terms: req.body.terms,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        res.json({ message: "success", contract: { id: snapshot.id, ...(await snapshot.get()).data() } });

    } catch (error) {
        res.json({ message: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const snapshot = db.collection("contract").doc(req.params.id);
        
        snapshot.update({
            ...req.body,
            updatedAt: new Date().toISOString()
        });
        res.json({ message: "success", contract: { id: req.params.id, ...(await snapshot.get()).data() } });
    } catch (error) {
        res.json({ message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const snapshot = await db.collection("contract").doc(req.params.id).delete();
        res.json({ message: "success" });
    } catch (error) {
        res.json({ message: error.message });
    }
});






module.exports = router;
