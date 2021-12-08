const config = require('../../../config/config');
const sendJsonResponse = require('../../../utils/sendJsonResponse');
const makeSignedBinanceRequest = require('../../../services/binance/makeSignedBinanceRequest');
const makeBinanceRequest = require('../../../services/binance/makeBinanceRequest');

const account = (req, res) => {
    const params = {
        secretKey: req.query.secretKey,
        apiKey: req.query.apiKey
    };

    makeSignedBinanceRequest(config, '/account', params)
        .then(binanceAccountResponse => {
            if (binanceAccountResponse) {
                const responseBalance = binanceAccountResponse.balances || [];
                const pricesPromises = [];

                const wallet = responseBalance.filter(balance => {
                   return parseFloat(balance.free) > 0
                });

                wallet.forEach(walletItem => {
                    pricesPromises.push(makeBinanceRequest(config, '/ticker/24hr', {
                        symbol: walletItem.asset + "USDT"
                    }));
                });

                Promise.allSettled(pricesPromises).then(pricesResponse => {
                    const pricesMap = {};

                    pricesResponse.forEach(price => {
                        if (price.status === "fulfilled" && price.value) {
                            pricesMap[price.value.symbol] = price.value;
                        }
                    });

                    wallet.forEach(walletItem => {
                        const walletItemSymbol = walletItem.asset + "USDT";

                        if (pricesMap[walletItemSymbol]) {
                            walletItem.price = pricesMap[walletItemSymbol].lastPrice;
                            walletItem.priceChangePercent = pricesMap[walletItemSymbol].priceChangePercent;
                        }
                    });

                    sendJsonResponse(res, 200, {
                        wallet
                    });
                })
                .catch(error => {
                    sendJsonResponse(res, 400, {
                        "error": "Invalid request to Binance. Error: " + error
                    });
                });
            } else {
                sendJsonResponse(res, 400, {
                    "error": "Invalid Binance account response."
                });
            }
        })
        .catch(error => {
            sendJsonResponse(res, 400, {
                "error": "Invalid request to Binance. Error: " + error
            });
        });
};

module.exports = account;
