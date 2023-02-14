const router = require('express').Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const emailsRef = db.collection('emails');

router.get('/', async (req, res) => {
    try {
        const snapshot = await emailsRef.get();
        const emails = [];
        snapshot.forEach(doc => {
            emails.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(emails);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});


router.post('/', checkEmail, async (req, res) => {
    try {
        const docRef = await emailsRef.add({
            ...req.body,
            createdAt: new Date().toISOString()
        });
        res.status(201).json({
            id: docRef.id,
            ...(await docRef.get()).data(),
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});

router.get('/:id', async (req, res) => {
    try {
        const docRef = await emailsRef.doc(req.params.id).get();
        if (!docRef.exists) {
            return res.status(404).json({
                message: 'Email not found'
            });
        }

        res.status(200).json({
            id: docRef.id,
            ...docRef.data()
        });

    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});

router.put('/:id', checkEmail, async (req, res) => {
    try {
        const docRef = await emailsRef.doc(req.params.id).get();
        if (!docRef.exists) {
            return res.status(404).json({
                message: 'Email not found'
            });
        }

        await emailsRef.doc(req.params.id).update(req.body);
        res.status(200).json({
            message: 'Email updated successfully',
            email: {
                id: docRef.id,
                ...req.body
            }
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});


// delete email 
router.delete('/:id', async (req, res) => {
    try {
        await emailsRef.doc(req.params.id).delete();
        res.status(200).json({
            message: 'Email deleted successfully'
        });
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
});



async function checkEmail(req, res, next) {
    try {
        const { title, subject, message, sender, receiver } = req.body;
        if (!title || !subject || !message || !sender || !receiver) {
            return res.status(400).json({
                message: 'Please fill all fields'
            });
        }
        if (message.length === 0) {
            return res.status(400).json({
                message: 'Message cannot be empty'
            });
        }
        
        if (receiver.length === 0) {
            return res.status(400).json({
                message: 'Reciever cannot be empty'
            });
        }
        if (sender.length === 0) {
            return res.status(400).json({
                message: 'Sender cannot be empty'
            });
        }
        next();
    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            loc: "checkEmail"
        })
    }
}



module.exports = router;