class PMChannel {
    constructor(data, client) {
        this.user = client.getUser("id", data.recipient.id);
        this.id = data.id;
		this.messages = [];
		this.client = client;
    }
    
    addMessage(data){
		if(!this.getMessage("id", data.id)){
			this.messages.push(data);
		}
		return this.getMessage("id", data.id);
	}
    
    getMessage(key, value){
		
		if(this.messages.length > 1000){
            this.messages.splice(0,1);
        }
		
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