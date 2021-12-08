const fetch = require('node-fetch');

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
    const searchParams = new URLSearchParams(params);

    const url = binanceApi.API_DOMAIN + binanceApi.API_PREFIX + endpoint + "?" + searchParams;

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
