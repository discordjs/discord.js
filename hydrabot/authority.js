var fs = require( "fs" );

var authCache = {};

exports.init = function() {
	try {
		var fd = fs.openSync( "./authority.json", "wx" );
        exports.writeCache();
	} catch ( e ) {
		if ( e.errno !== -4075 ){
			throw e;
        }else{
            authCache = JSON.parse(fs.readFileSync("./authority.json", "utf8"));
        }
	}
}

exports.getLevel = function(user){

    if(authCache[user.id])
        return authCache[user.id];
    else
        return 0;

}

exports.setLevel = function(user, level){
    authCache[user.id] = level;
    exports.writeCache();
}

exports.writeCache = function() {
	fs.writeFile( './authority.json', JSON.stringify(authCache), function( err ) {
		if ( err )
            console.log("Error saving Authority Caches - " + err.code);
	} );
}
