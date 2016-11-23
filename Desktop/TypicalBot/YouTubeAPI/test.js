const YouTube = require("simple-youtube-api");
const YTAPI = new YouTube("AIzaSyC4UCcmejRT2-d1A5hNmryyqlDKZB5psY0")

YTAPI.search("Centuries")
    .then(console.log)
    .catch(console.log)
