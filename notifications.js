const { Client } = require('discord.js');
const { token } = require('./config.json');
const client = new Client;

console.log(client);

client.login(token);