const User = require('./User');

class ClientUser extends User {
  setup(data) {
    super.setup(data);
    this.verified = data.verified;
    this.email = data.email;
  }

  setUsername(username) {
    return this.client.rest.methods.updateCurrentUser({ username });
  }

  setEmail(email) {
    return this.client.rest.methods.updateCurrentUser({ email });
  }

  setPassword(password) {
    return this.client.rest.methods.updateCurrentUser({ password });
  }

  setAvatar(avatar) {
    return this.client.rest.methods.updateCurrentUser({ avatar });
  }

  edit(data) {
    return this.client.rest.methods.updateCurrentUser(data);
  }
}

module.exports = ClientUser;
