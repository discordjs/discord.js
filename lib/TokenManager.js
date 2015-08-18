var fs = require( "fs" );
var crypto = require( "crypto" );
var md5 = require( "md5" );

var tokens = {};

exports.TokenManager = function( folder, file ) {

	this.path = folder + file;

	var self = this;

	try {
		var fd = fs.openSync( self.path, "wx" );
		self.writeTokens();
	} catch ( e ) {
		if ( e.errno !== -4075 ) {
			throw e;
		} else {
			self.readTokens();
		}
	}

}

exports.TokenManager.prototype.addToken = function( id, token, pass ) {
	tokens[ md5( id ) ] = encrypt( token, pass );
	this.writeTokens();
}

exports.TokenManager.prototype.readTokens = function() {
	tokens = JSON.parse( fs.readFileSync( this.path, "utf8" ) );
	for ( tkn in tokens ) {
		tokens[ tkn ] = decrypt( tokens[ tkn ], tkn );
	}
}

exports.TokenManager.prototype.writeTokens = function() {
	var tkn = {};
	for ( token in tokens ) {
		tkn[ token ] = encrypt( tokens[ token ], token );
	}
	fs.writeFile( this.path, JSON.stringify( tkn ), function( err ) {

	} );
}

exports.TokenManager.prototype.exists = function( id ) {
	return tokens[ md5( id ) ];
}

exports.TokenManager.prototype.getToken = function( id, pass ) {
    try{
        return decrypt( tokens[ md5( id ) ], pass );
    }catch(e){
        return false;
    }
}

function encrypt( string, password ) {
	var cipher = crypto.createCipher( "aes-256-ctr", password )
	var crypted = cipher.update( string, 'utf8', 'hex' )
	crypted += cipher.final( 'hex' );
	return crypted;
}

function decrypt( string, password ) {
	var decipher = crypto.createDecipher( "aes-256-ctr", password )
	var dec = decipher.update( string, 'hex', 'utf8' )
	dec += decipher.final( 'utf8' );
	return dec;
}
