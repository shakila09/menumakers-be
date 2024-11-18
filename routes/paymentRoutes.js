const express = require('express');
const { createCheckoutSession,savePurchase } = require('../controllers/stripeController');
const router = express.Router();

router.post('/create-checkout-session', createCheckoutSession);
router.post('/save-purchase', savePurchase);



module.exports = router;