const fetch = require('node-fetch');
const hmacSHA512 = require('crypto-js/hmac-sha256');

/**
 * @param {object} config
 * @param {string} endpoint
 * @param {object} params
 * @returns {Promise}
 */
const makeBinanceRequest = (config, endpoint, params = {}) => {
    if (!config.BINANCE_API) {
        return Promise.reject("Invalid Binance API config");
    };
    console.log(config);

    const binanceApi = config.BINANCE_API;
    const binanceSecretKey = params.secretKey;
    const timestamp = Date.now();
    let binanceParams = {};
    //
    // if (params) {
    //     Object.keys(params).forEach(key => {
    //         if (key !== 'signature' && key !== 'timestamp' && !isEmptyQueryString(params[key])) {
    //             binanceParams[key] = params[key];
    //         }
    //     });
    // }

    Object.assign(binanceParams, { timestamp });

    if (binanceSecretKey) {
        const queryString = Object.keys(binanceParams).map((key) => {
            return `${key}=${binanceParams[key]}`;
        }).join('&');

        const signature = hmacSHA512(queryString, binanceSecretKey).toString();
        Object.assign(binanceParams, { signature });
    }
    console.log(binanceParams);

    const signedParams = new URLSearchParams(binanceParams);

    const url = binanceApi.API_DOMAIN + binanceApi.API_PREFIX + endpoint + "?" + signedParams;

    console.log(url);
    return fetch(url, {
        headers: {
            "Cache-Control": "no-cache",
            "content-type": "application/json",
            "credentials": "include",
            "X-MBX-APIKEY": params.apiKey
        }
    });
};

module.exports = makeBinanceRequest;
