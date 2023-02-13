const router = require('express').Router();
const admin = require('firebase-admin');
const db = admin.firestore();


router.get('/', async (req, res) => {
    try {
        const opportunities = await db.collection('opportunities').get();
        const opportunitiesArray = [];
        opportunities.forEach((doc) => {
            opportunitiesArray.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.status(200).json(opportunitiesArray);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const opportunity = await db.collection('opportunities').doc(req.params.id).get();
        res.status(200).json({
            id: opportunity.id,
            ...opportunity.data()
        });
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/', async (req, res) => {
    try {
        const opportunity = await db.collection('opportunities').add({
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        res.status(200).json({
            id: opportunity.id,
            ...(await opportunity.get()).data()
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const opportunity = await db.collection('opportunities').doc(req.params.id);

        await opportunity.update({
            ...req.body,
            updatedAt: new Date().toISOString(),
        });

        res.status(200).json({
            id: opportunity.id,
            ...(await opportunity.get()).data()
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const opportunity = db.collection('opportunities').doc(req.params.id)
        const data = await opportunity.get();

        await opportunity.delete();

        res.status(200).json({
            message: 'Opportunity deleted successfully',
            opportunity: {
                id: req.params.id,
                ...data.data()
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});









module.exports = router;