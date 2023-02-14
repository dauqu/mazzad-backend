const router = require("express").Router();
const admin = require("firebase-admin");
const db = admin.firestore();
const logCollection = db.collection("logs");

router.get("/", async (req, res) => {
    try {
    const allLogs = await logCollection
        .get();

    const logs = [];
    allLogs.forEach((doc) => {
        logs.push({
            id: doc.id,
            ...doc.data(),
        });
    });

    res.status(200).json({
        message: "Logs fetched successfully",
        logs
    });
        
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.post("/", async (req, res) => {
    try {
        const {type, title, description} = req.body;
        const log = {
            type,
            title,
            createdAt: new Date().toISOString(),
        };

        const newLog = await logCollection.add(log);
        return res.status(201).json({
            message: "Log created successfully",
            log: {
                id: newLog.id,
                ...(await newLog.get()).data()
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        await logCollection.doc(id).delete();
        return res.status(200).json({
            message: "Log deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/clear/:type", async (req, res) => {
    try {
        const {type} = req.params;
        const allLogs = await logCollection
            .where("type", "==", type)
            .get();

        allLogs.forEach(async (doc) => {
            await logCollection.doc(doc.id).delete();
        });

        return res.status(200).json({
            message: "Logs deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});










module.exports = router;