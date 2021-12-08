const fetch = require('node-fetch');
const hmacSHA512 = require('crypto-js/hmac-sha256');

/**
 * @param {object} config
 * @param {string} endpoint
 * @param {object} params
 * @returns {Promise|object}
 */
const makeBinanceRequest = (config, endpoint, params = {}) => {
    if (!config.BINANCE_API) {
        return Promise.reject("Invalid Binance API config");
    };

    const binanceApi = config.BINANCE_API;
    const binanceSecretKey = params.secretKey;
    const timestamp = Date.now();
    let binanceParams = {};

    Object.assign(binanceParams, { timestamp });

    if (binanceSecretKey) {
        const queryString = Object.keys(binanceParams).map((key) => {
            return `${key}=${binanceParams[key]}`;
        }).join('&');

        const signature = hmacSHA512(queryString, binanceSecretKey).toString();
        Object.assign(binanceParams, { signature });
    }

    const signedParams = new URLSearchParams(binanceParams);

    const url = binanceApi.API_DOMAIN + binanceApi.API_PREFIX + endpoint + "?" + signedParams;

    return fetch(url, {
        headers: {
            "Cache-Control": "no-cache",
            "content-type": "application/json",
            "credentials": "include",
            "X-MBX-APIKEY": params.apiKey
        }
    }).then(response => response.json());
};

module.exports = makeBinanceRequest;
