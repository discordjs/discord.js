/* global document URLSearchParams Discord */
/* eslint-disable no-console */

// This example assumes you are running in a browser (hence document and URLSearchParams)

const clientID = '187406016902594560';
const scopes = ['rpc', 'rpc.api', 'messages.read'];

// This demonstrates discord's implicit oauth2 flow
// http://discordapi.com/topics/oauth2#implicit-grant

const params = new URLSearchParams(document.location.hash.slice(1));

if (!params.has('access_token')) {
  // Redirect to discord to get an access token
  document.location.href =
    `https://discordapp.com/oauth2/authorize?response_type=token&client_id=${clientID}&scope=${scopes.join('%20')}`;
}

const client = new Discord.RPCClient();

client.on('ready', () => {
  console.log('Logged in as', client.application.name);
  console.log('Authed for user', client.user.tag);
});

// Log in to rpc with client id and access token
client.login(clientID, { accessToken: params.get('access_token') });
