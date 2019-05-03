
/**
 * Converts seconds
 * in minutes if needed
 *
 * @param {*} seconds
 * @returns {string} time
 */
const converter = (seconds) => {
  if (seconds > 60) {
    return `${Math.floor(seconds / 60)} min ${seconds % 60 !== 0 ? `${Math.floor(seconds % 60)} s` : ''}`;
  }

  return `${Math.floor(seconds)} s`;
};

/**
 *This function calculates the time
 * it takes to read an article,
 * based on the average reading speed
 * of an adult which is 275 WPM or 4 WPS
 *
 * @param {*} title
 * @param {*} description
 * @param {*} body
 * @returns {number} time
 */
const readTime = (title, description, body) => {
  const WPS = 4;
  const wordCount = text => text.split(' ').length;

  const words = wordCount(title) + wordCount(description) + wordCount(body);

  const seconds = words / WPS;

  return converter(seconds);
};

export default readTime;
