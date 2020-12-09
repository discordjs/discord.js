'use strict';

const assert = require('assert');
const { token, test_guild_id, test_user_id } = require('./auth');
const { Client } = require('../src');

// Create client
const client = new Client({});

// Test role create and deletion
client.on('ready', async () => {

  try {

    // Fetch guild to use
    const guild = await client.guilds.fetch(test_guild_id);
    
    // Create the new role with specified details
    let new_role = await guild.roles.create({
      data: {
        name: 'Super Cool People',
        color: 'BLUE',
        permissions: [
          'ADMINISTRATOR'
        ]
      }
    });

    // Check to make sure role created successfully with specified details
    assert.strictEqual(new_role.name, 'Super Cool People');
    assert.strictEqual(new_role.color, 3447003);
    assert.strictEqual(new_role.permissions.has('ADMINISTRATOR'), true);

    // Edit role with new name and new permissions
    await new_role.edit({
      name: 'Super Duper Cool People',
      permissions: [
        'MANAGE_GUILD',
        'KICK_MEMBERS'
      ]
    });

    // Check to make sure role edited successfully with specified details
    assert.strictEqual(new_role.name, 'Super Duper Cool People');
    assert.strictEqual(new_role.color, 3447003);
    assert.strictEqual(new_role.permissions.has('MANAGE_GUILD', 'KICK_MEMBERS'), true);

    // Fetch member to use
    let user = await guild.members.fetch(test_user_id);

    // Try to assign role to the user
    user = await user.roles.add(new_role);

    // Check if role was added to the user
    let role_added = false;
    user._roles.forEach(element => {
      if (element === new_role.id) {
        role_added = true;
      }
    });
    assert.strictEqual(role_added, true);

    // Edit role with new name and permissions
    await new_role.edit({
      name: 'Administrator',
      color: 'RED'
    });

    // Check to make sure role edited successfully with specified details
    assert.strictEqual(new_role.name, 'Administrator');
    assert.strictEqual(new_role.color, 15158332);
    assert.strictEqual(new_role.permissions.has('MANAGE_GUILD', 'KICK_MEMBERS'), true);

    // Remove role from user and delete role
    user = await user.roles.remove(new_role);

    // Check if role was added to the user
    let role_removed = true;
    user._roles.forEach(element => {
      if (element === new_role.id) {
        role_removed = false;
      }
    });
    assert.strictEqual(role_removed, true);

    // Delete the role from the server
    await new_role.delete();
    //assert.strictEqual(new_role.deleted, true);

  } catch (error) {
    console.error(error);
  }

  // Destroy client and end test
  client.destroy();

});

client.login(token).catch(console.error);
