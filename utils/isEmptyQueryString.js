/**
 *
 * @param {string} value
 * @returns {boolean}
 */
const isEmptyQueryString = (value) => {
    if (typeof value == 'undefined' ||
        !value ||
        value.length === 0 ||
        value === "" ||
        !/[^\s]/.test(value) ||
        /^\s*$/.test(value) ||
        value.replace(/\s/g,"") === "") {
        return true;
    } else {
        return false;
    }
};

module.exports = isEmptyQueryString;
