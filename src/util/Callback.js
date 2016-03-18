// This utility function creates an anonymous error handling wrapper function
// for a given callback. It is used to allow error handling inside the callback
// and using other means.
function errorCallback(callback) {
	return error => {
		callback(error);
		throw error;
	};
}

// This utility function creates an anonymous handler function to separate the
// error and the data arguments inside a callback and return the data if it is
// eventually done (for promise propagation).
function successCallback(callback) {
	return data => {
		callback(null, data);
		return data;
	}
}

module.exports = {
	error:   errorCallback,
	success: successCallback,
	handle:  (promise, resolve, reject, callback) => {
		if (typeof callback === 'function') {
			return promise.then(successCallback, errorCallback);
		}

		return promise.then(resolve).catch(reject);
	}
};
