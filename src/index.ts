import discord = require('discord.js');
import { TOKEN, BOT_PREFIX } from './config';
import Bot from './Bot';

const client: any = new discord.Client();

client.on(
    'message',
    (message: any): string | void => {
        if (message.author.bot) return;
        if (message.content.trimLeft().startsWith(BOT_PREFIX)) {
            let response: string | void = Bot.commandCenter(message);
            if (response) message.channel.send(`\`${response}\``);
        } else if (message.content.startsWith('[') && message.content.endsWith(']')) {
            // emoji/image response
            let emoji: string = message.content.slice(1, -1);
            return;
        }
    },
);

client.login(TOKEN);
