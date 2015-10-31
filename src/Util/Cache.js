"use strict";

class Cache extends Array{
	constructor(discrim, limit){
		super();
		this.discrim = discrim || "id";
	}
	
	get(key, value){
		var found = null;
		this.forEach( (val, index, array) => {
			if(val.hasOwnProperty(key) && val[key] == value){
				found = val;
				return;
			}
		} );
		return found;
	}
	
	getAll(key, value){
		var found = [];
		this.forEach( (val, index, array) => {
			if(val.hasOwnProperty(key) && val[key] == value){
				found.push(val);
				return;
			}
		} );
		return found;
	}
	
	add(data){
		var exit = false;
		for(var item of this){
			if(item[this.discrim] === data[this.discrim]){
				exit = item;
				break;
			}
		}
		if(exit){
			return exit;
		}else{
			if(this.limit && this.length >= this.limit){
				this.splice(0, 1);
			}
			this.push(data);
			return data;
		}
	}
}

module.exports = Cache;