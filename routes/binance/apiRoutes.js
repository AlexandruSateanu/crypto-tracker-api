var express = require('express');
var router = express.Router();

router.get('/account', require('../../middlewares/binance/account/account'));

module.exports = router;
