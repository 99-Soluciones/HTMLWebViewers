/**
 * Format the title to include a line break if it exceeds maxLength.
 *
 * @param {string} title - the title to format
 * @param {number} maxLength - number of characters before inserting a line break
 * @returns {string} Formatted title with <br> if needed
 */
function formatTitleWithWrap(title, maxLength) {

  if (title.length <= maxLength) {
    return title;
  }

  const breakIndex = title.indexOf(' ', maxLength);

  if (breakIndex === -1) {
    return title;
  }

  const firstLine = title.slice(0, breakIndex);
  const secondLine = title.slice(breakIndex + 1);

  return `${firstLine}<br>${secondLine}`;
}

export { formatTitleWithWrap };