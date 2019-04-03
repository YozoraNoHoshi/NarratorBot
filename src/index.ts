import discord = require('discord.js');
import { TOKEN, BOT_PREFIX } from './config';
import Bot from './models/Bot';
import CustomEmoji from './models/Emoji';

const client: any = new discord.Client();

client.on('ready', () => {
    console.log('Drain your glass!');
    client.user.setActivity('anime.', { type: 'WATCHING' });
});

client.on(
    'message',
    async (message: any): Promise<string | void> => {
        if (message.author.bot) return;
        try {
            // standard commands that start with prefix (default '!')
            if (message.content.trimLeft().startsWith(BOT_PREFIX)) {
                let response: string | void = await Bot.commandCenter(message);
                if (response) message.channel.send(`\`\`\`${response}\`\`\``);
            }
            // emoji/image response, expects format '[emoji]'
            else if (message.content.startsWith('[') && message.content.endsWith(']')) {
                let emoji: string = message.content.slice(1, -1);
                let response: string | void = await CustomEmoji.emoji(emoji);
                if (response) message.channel.send(new discord.Attachment(response));
            }
        } catch (error) {
            // if something blows up, bot doesn't crash
            message.channel.send(`\`Error ${error.status}: ${error.message}\``);
        }
    },
);

client.login(TOKEN);
