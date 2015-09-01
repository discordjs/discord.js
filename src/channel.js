class Channel {

    constructor(data, server) {
        this.server = server;
        this.name = data.name;
        this.type = data.type;
        this.id = data.id;
        this.messages = [];
        //this.isPrivate = isPrivate; //not sure about the implementation of this...
    }

    get client() {
        return this.server.client;
    }

    equals(object) {
        return (object && object.id === this.id);
    }
    
    addMessage(data){
		if(!this.getMessage("id", data.id)){
			this.messages.push(data);
		}
		return this.getMessage("id", data.id);
	}
    
    getMessage(key, value){
		for(var message of this.messages){
			if(message[key] === value){
				return message;
			}
		}
		return null;
	}

    toString(){
        return "#" + this.name;
    }
    
    get isPrivate(){
        return false;
    }
}

module.exports = Channel;