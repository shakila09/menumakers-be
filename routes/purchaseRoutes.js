const express = require('express');
const router = express.Router();
const { getUserPurchases } = require('../controllers/getPurchases');

router.get('/User-purchases', getUserPurchases);

module.exports = router;
