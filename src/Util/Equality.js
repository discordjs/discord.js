/*
	The Equality Class is just used to show
	that a Class has an ID that can be used to
	check for equality.

	Never use == or === when comparing
	objects in discord.js, they will be different
	instances sometimes.

	Instead, use objectThatExtendsEquality.equals()
*/
export default class Equality{
	constructor(){

	}

	get eqDiscriminator(){
		return "id";
	}

	equals(object){
		return object && object[this.eqDiscriminator] === this[this.eqDiscriminator];
	}

	equalsStrict(object){
		// override per class type
		return;
	}
}
