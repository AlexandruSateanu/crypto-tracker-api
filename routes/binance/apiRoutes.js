const express = require('express');
const router = express.Router();

router.get('/account', require('../../middlewares/binance/account/account'));

module.exports = router;
