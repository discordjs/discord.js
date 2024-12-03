'use strict';

function deleteProperties(objectsArray, propertiesToRemove) {
  const propertiesSet = new Set(propertiesToRemove);

  objectsArray.forEach(obj => {
    for (const prop of propertiesSet) {
      delete obj[prop];
    }
  });

  return objectsArray;
}

module.exports = { deleteProperties };
