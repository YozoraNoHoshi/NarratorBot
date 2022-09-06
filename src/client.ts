import { Client, GatewayIntentBits } from 'discord.js';

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

export default client;
