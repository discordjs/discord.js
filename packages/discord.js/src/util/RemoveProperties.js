'use strict';

function removeProperties(objectsArray, propertiesToRemove) {
  const propertiesSet = new Set(propertiesToRemove);

  objectsArray.forEach(obj => {
    for (const prop of propertiesSet) {
      obj[prop] = undefined;
    }
  });

  return objectsArray;
}

module.exports = { removeProperties };
