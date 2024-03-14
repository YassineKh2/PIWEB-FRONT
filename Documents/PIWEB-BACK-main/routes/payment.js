// Import dependencies
const express = require('express');
const router = express.Router();

// Import paymentController
const paymentController = require('../controllers/paymentController');

// Route to create a PaymentIntent
router.post('/create-checkout-session', express.json(), paymentController.createCheckoutSession);

// Route to handle Stripe webhook
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.stripeWebhook);

// Export the router
module.exports = router;