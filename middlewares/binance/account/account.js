const config = require('../../../config/config');
const sendJsonResponse = require('../../../utils/sendJsonResponse');
const makeBinanceRequest = require('../../../services/binance/makeBinanceRequest');

const account = (req, res) => {
    const params = {
        secretKey: req.query.secretKey,
        apiKey: req.query.apiKey
    };

    makeBinanceRequest(config, '/account', params)
        .then(binanceResponse => {
            sendJsonResponse(res, 200, binanceResponse);
        })
        .catch(error => {
            sendJsonResponse(res, 400, {
                "error": "Invalid request to Binance. Error: " + error
            });
        });
};

module.exports = account;
