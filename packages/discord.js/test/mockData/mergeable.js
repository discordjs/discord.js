'use strict';

module.exports.mergeable = base => mergeData => ({
  ...base,
  ...mergeData,
});
