/**
 *
 * @param {array} arr
 * @returns {array} processed array
 */
const removeDuplicates = arr => [...new Set(arr)];

export default removeDuplicates;
