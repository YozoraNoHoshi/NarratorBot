import discord = require('discord.js');
import { TOKEN, BOT_PREFIX } from './config';
import Bot from './models/Bot';
import CustomEmoji from './models/Emoji';
import { SendMsgEmbed } from './types';
import client from './client';
import MessageLog from './models/MessageLog';

client.on('ready', () => {
    console.log('Drain your glass!');
    client.user.setActivity('the fluff.', { type: 'WATCHING' });
});

client.on(
    'message',
    async (message: any): Promise<string | void> => {
        try {
            if (message.author.bot) return;
            if (message.guild) {
                // standard commands that start with prefix
                if (message.content.trimLeft().startsWith(BOT_PREFIX)) {
                    message.noPrefix = message.content.slice(BOT_PREFIX.length);
                    let response: string | void | SendMsgEmbed = await Bot.commandCenter(message);
                    if (response) message.channel.send(response);
                }
                // emoji/image response, expects format '[emoji]'
                else if (message.content.startsWith('[') && message.content.endsWith(']')) {
                    let emoji: string = message.content.slice(1, -1);
                    let response: string | void = await CustomEmoji.emoji(emoji);
                    if (response) message.channel.send(new discord.Attachment(response));
                }
            }
        } catch (error) {
            // if something blows up, bot doesn't crash
            error.status = error.status || 500;
            message.channel.send(`\`Error ${error.status}: ${error.message}\``);
        }
    },
);

client.on('messageDelete', (message: any) => {
    // add it to the messageLog class via method
    try {
        if (!message.author.bot && message.guild) {
            MessageLog.addDeleted(message);
        }
    } catch (error) {}
});

client.login(TOKEN);
