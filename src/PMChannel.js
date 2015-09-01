class PMChannel {
    constructor(data, client) {
        this.user = client.getUser("id", data.recipient.id);
        this.id = data.id;
		this.messages = [];
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
	
    get isPrivate(){
        return true;
    }
}

module.exports = PMChannel;