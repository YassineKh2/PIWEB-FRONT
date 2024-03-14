const stripe = require("stripe")(process.env.STRIPE_SECRET);

exports.createCheckoutSession = async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'Consultation',
                    },
                    unit_amount: amount * 100, // Amount in cents
                },
                quantity: 1,
            }],
            mode: 'payment',
success_url: 'http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}',
cancel_url: 'http://localhost:3000/payment-cancelled',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

    // Assuming you've set up express to not parse the body and make rawBody available.
    const rawBody = req.rawBody; // Ensure this is a Buffer

    try {
        const event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);

        console.log('Webhook event:', event);

        switch (event.type) {
            case 'payment_intent.requires_action':
                // Handle the event
                break;
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                console.log('Payment intent succeeded:', paymentIntentSucceeded);
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.status(200).send();
    } catch (err) {
        console.error('Error verifying webhook signature:', err);
        res.status(400).send(`Webhook error: ${err.message}`);
    }
};