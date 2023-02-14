const router = require('express').Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const smsRef = db.collection('sms');


router.get('/', async (req, res) => {
    try {
        const snapshot = await smsRef.get();
        const sms = [];
        snapshot.forEach(doc => {
            sms.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(sms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await smsRef.doc(id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'SMS not found' });
        } else {
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const doc = await smsRef.add({
            title: req.body.title,
            message: req.body.message,
            sender: req.body.sender,
            receiver: req.body.receiver,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({
            id: doc.id,
            ...(await doc.get()).data()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await smsRef.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'SMS not found' });
        } else {
            await smsRef.doc(id).delete();
            return res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});






module.exports = router;