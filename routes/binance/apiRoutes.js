const express = require('express');
const router = express.Router();

router.get('/wallet', require('../../middlewares/binance/account/account'));

module.exports = router;
