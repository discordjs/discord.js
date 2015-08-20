/**
 * Similar to a Java set. Contains no duplicate elements and includes filter
 * functions. Discriminates between elements based on a discriminator passed
 * when created. Generally "ID"
 * @class List
 */
exports.List = function( discriminator, cap ) {
	/**
	 * What to use to distringuish duplicates
	 * @attribute discriminator
	 * @type {String}
	 */
	this.discriminator = discriminator;
	/**
	 * The maximum amount of elements allowed in the list.
	 * @default Infinity
	 * @attribute cap
	 * @type {Number}
	 */
	this.cap = cap || Number.MAX_SAFE_INTEGER;
	/**
	 * The Array version of the List.
	 * @type {Array}
	 * @attribute contents
	 */
	this.contents = [];
}

/**
 * Adds an element to the list if it isn't already there.
 * @method add
 * @param {Object/Array} element The element(s) to add
 * @example
 *     List.add( obj );
 *     List.add( [ obj, obj, obj ] );
 */
exports.List.prototype.add = function( child ) {

	var self = this;

	if ( child.constructor === Array ) {

		children = child;
		for ( child of children ) {
			addChild( child );
		}

	} else {
		addChild( child );
	}

	function addChild( child ) {

		if ( self.length() > self.cap ) {
			self.splice( 0, 1 );
		}

		if ( self.filter( self.discriminator, child[ self.discriminator ] ).length() === 0 )
			self.contents.push( child );
	}
}

/**
 * Returns the length of the List
 * @method length
 * @return {Number}
 */
exports.List.prototype.length = function() {
	return this.contents.length;
}

/**
 * Gets the index of an element in the List or defaults to false
 * @param  {Object} object The element we want to get the index of
 * @return {Number/Boolean} The index if the object is in the list, or false.
 * @method getIndex
 */
exports.List.prototype.getIndex = function( object ) {

	var index = false;

	for ( elementIndex in this.contents ) {
		var element = this.contents[ elementIndex ];
		if ( element[ this.discriminator ] == object[ this.discriminator ] ) {
			return elementIndex;
		}

	}

	return index;

}

/**
 * Removes an element at the specified index
 * @param  {Number} index
 * @method removeIndex
 */
exports.List.prototype.removeIndex = function( index ) {
	this.contents.splice( index, 1 );
}

/**
 * Removes an element from the list
 * @param  {Object} element
 * @method removeElement
 * @return {Boolean} whether the operation was successful or not.
 */
exports.List.prototype.removeElement = function( child ) {

	for ( _element in this.contents ) {
		var element = this.contents[ _element ];
		if ( child[ this.discriminator ] == element[ this.discriminator ] ) {
			this.removeIndex( _element, 1 );
			return true;
		}
	}

	return false;
}

/**
 * Replaces an element in the list with a specified element
 * @method updateElement
 * @param  {Object} element Element to update.
 * @param  {Object} newElement New Element
 * @return {Boolean} whether the operation was successful or not.
 */
exports.List.prototype.updateElement = function( child, newChild ) {

	for ( _element in this.contents ) {
		var element = this.contents[ _element ];
		if ( child[ this.discriminator ] == element[ this.discriminator ] ) {
			this.contents[ _element ] = newChild;
			return true;
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

exports.List.prototype.filter = function( key, value, onlyOne, caseInsen ) {

	var results = [];
	value = change( value );

	for ( index in this.contents ) {
		var child = this.contents[ index ];
		if ( change( child[ key ] ) == value ) {
			if ( onlyOne ) {
				return child;
			} else {
				results.push( child );
			}
		}
	}

	function change( val ) {
		if ( caseInsen ) {
			val = val.toUpperCase();
		}
		return val;
	}

	if ( onlyOne ) {
		return false;
	}

	var retList = new exports.List( this.discriminator );
	retList.contents = results;

	return retList;
}

exports.List.prototype.getValues = function( key ){

	var valList = [];
	for( child of this.contents){
		valList.push( child[key] );
	}
	return valList;

}

exports.List.prototype.deepFilter = function( keys, value, onlyOne ) {

	var results = [];
	value = change( value );

	for ( index in this.contents ) {
		var child = this.contents[ index ];
		var buffer = child;

		for ( key of keys ) {
			buffer = buffer[ key ];
		}

		if ( change( buffer ) == value ) {
			if ( onlyOne ) {
				return child;
			} else {
				results.push( child );
			}
		}
	}

	function change( val ) {
		if ( caseInsen ) {
			val = val.toUpperCase();
		}
		return val;
	}

	if ( onlyOne ) {
		return false;
	}

	var retList = new exports.List( this.discriminator );
	retList.contents = results;

	return retList;
}
