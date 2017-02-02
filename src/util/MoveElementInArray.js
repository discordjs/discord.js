/**
 * Moves an element in an array *in place*
 * @param {Array} array Array to modify
 * @param {*} element Element to move
 * @param {number} newIndex Index or offset to move the element to
 * @param {boolean} [offset=false] Move the element by an offset amount rather than to a set index
 * @returns {Array}
 */
module.exports = function moveElementInArray(array, element, newIndex, offset = false) {
  const index = array.indexOf(element);
  newIndex = (offset ? index : 0) + newIndex;
  if (newIndex > -1 && newIndex < array.length) {
    const removedElement = array.splice(index, 1)[0];
    array.splice(newIndex, 0, removedElement);
  }
  return array;
};
