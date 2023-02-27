const router = require('express').Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const transactionRef = db.collection('transactions');
const { getAuthUser } = require('../functions/getauth');

// Get all transactions
router.get('/', async (req, res) => {
    try {
        const snapshot = await transactionRef.get();
        const transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a transaction
router.get('/my', getAuthUser, async (req, res) => {
    try {
        const user = req.user;

        const doc = await transactionRef
            .where('user', '==', user.id)
            .get();

        let transactions = [];
        doc.forEach(transaction => {
            transactions.push({ id: transaction.id, ...transaction.data() });
        });

        transactions = transactions.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return res.status(200).json({transactions});

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
});

// Add a transaction
router.post('/',getAuthUser, async (req, res) => {
    try {
        const user = req.user;
        const doc = await transactionRef.add({
            title: req.body.title,
            amount: req.body.amount,
            description: req.body.description,
            type: req.body.type || "wallet",
            action: req.body.action || "add",
            user: user.id,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ id: doc.id, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a transaction
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const doc = await transactionRef.doc(id).get();
        if (!doc.exists) {
            res.status(404).json({ error: 'Transaction not found' });
        } else {
            await transactionRef.doc(id).update({
                title: req.body.title,
                amount: req.body.amount,
                type: req.body.type,
                description: req.body.description,
                category: req.body.category,
                user: req.body.user,
                createdAt: new Date().toISOString()
            });
            res.status(200).json({ id: doc.id, ...req.body });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const doc = await transactionRef.doc(id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Transaction not found' });
        } else {
            await transactionRef.doc(id).delete();
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });

    }
});









module.exports = router;
