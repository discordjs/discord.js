exports.List = function( discriminator ) {
	this.discriminator = discriminator;
	this.contents = [];
}

exports.List.prototype.add = function( child ) {
	if ( child.constructor === Array ) {

		children = child;
		for ( child of children ) {
			if ( this.filter( this.discriminator, child[ this.discriminator ] ).length === 0 )
				this.contents.push( child );
		}

	} else {
		if ( this.filter( this.discriminator, child[ this.discriminator ] ).length === 0 )
			this.contents.push( child );
	}
}

exports.List.prototype.length = function() {
	return this.contents.length;
}

exports.List.prototype.removeIndex = function( index ) {
	this.contents.splice( index, 1 );
}

exports.List.prototype.removeElement = function( child ) {

	for ( _element in this.contents ) {
		var element = this.contents[_element];
		if ( child[ this.discriminator ] == element[ this.discriminator ] ) {
			this.removeIndex( _element, 1 );
		}
	}

	return false;
}

exports.List.prototype.concatSublists = function( whereList, discriminator ) {
	//this is meant to look at the contents, and assuming the contents are all lists, concatenate their values.

	var concatList = new exports.List( discriminator );

	for ( item of this.contents ) {
		var itemList = item[ whereList ];
		concatList.add( itemList.contents );
	}

	return concatList;
}

exports.List.prototype.filter = function( key, value, onlyOne ) {

	var results = [];

	for ( index in this.contents ) {
		var child = this.contents[ index ];
		if ( child[ key ] == value ) {
			if ( onlyOne ) {
				return child;
			} else {
				results.push( child );
			}
		}
	}

	if ( onlyOne ) {
		return false;
	}

	return results;
}

exports.List.prototype.deepFilter = function( keys, value, onlyOne ) {

	var results = [];

	for ( index in this.contents ) {
		var child = this.contents[ index ];
		var buffer = child;

		for ( key of keys ) {
			buffer = buffer[ key ];
		}

		if ( buffer == value ) {
			if ( onlyOne ) {
				return child;
			} else {
				results.push( child );
			}
		}
	}

	if ( onlyOne ) {
		return false;
	}

	return results;
}
