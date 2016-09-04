module.exports = function Encode(uri) {
    return Object.keys(uri).map(key => {
        let param = `${encodeURIComponent(key)}=`;
        if (Array.isArray(uri[key])) return uri[key].map(keyVar => {return `${param}${encodeURIComponent(keyVar)}`;}).join('&');
        return `${param}${encodeURIComponent(uri[key])}`;
    }).join('&');
};
