const router = require("express").Router();

const stripe = require('stripe')("sk_test_tR3PYbcVNZZ796tH88S4VQ2u")



router.post('/payment-intent', async (req, res) => {

    const customer = await stripe.customers.create({
        description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
    });

    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({
        ...paymentIntent,
        client_secret: paymentIntent.client_secret,

    });
});


router.get("/customer/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const customer = await stripe.customers.retrieve(
            id
        );

        return res.status(200).json({
            ...customer,
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
        
    }
})



module.exports = router;
