// import discord = require('discord.js');
import { TOKEN, BOT_PREFIX, EMOJI_PREFIX, EMOJI_SUFFIX, EXTRA_FLAGS } from './config';
import { PrefMessage, SendMsgEmbed } from './types';
import Bot from './models/Bot';
import CustomEmoji from './models/Emoji';
import client from './client';
import MessageLog from './models/MessageLog';
import { Message, Attachment } from 'discord.js';

client.on('ready', () => {
  console.log('Drain your glass!');
  client.user.setActivity(process.env.ACTIVITY_LABEL || 'anime.', { type: 'WATCHING' });
});

client.on(
  'message',
  async (message: Message & PrefMessage): Promise<void> => {
    try {
      if (message.author === client.user) {
        // If message received is from this user and has a reaction from this user, activate the reaction await
        // probably will have to parse out the embed and figure out the source of the command based on the author/title
        // https://discord.js.org/#/docs/main/stable/class/Message?scrollTo=awaitReactions
        return;
      } else if (message.author.bot) {
        // Do not respond to other bots
        return;
      }
      if (message.guild) {
        // standard commands that start with prefix
        if (message.content.trimLeft().startsWith(BOT_PREFIX)) {
          message.noPrefix = message.content.slice(BOT_PREFIX.length);
          let response = await Bot.commandCenter(message);
          if (response) {
            Array.isArray(response)
              ? response.forEach(async (r: string | SendMsgEmbed) => await message.channel.send(r))
              : message.channel.send(response);
          }
        }
        // emoji/image response
        else if (message.content.match(new RegExp(`^(${EMOJI_PREFIX})(\\w+)(${EMOJI_SUFFIX})?(\\s)?(${EXTRA_FLAGS}[a-z]+)?`))) {
          let [content, flag] = message.content.split(EXTRA_FLAGS)
          let end: number = -EMOJI_SUFFIX.length || message.content.length;
          let emoji = content.trim().slice(EMOJI_PREFIX.length, end)
          let response: string | void = await CustomEmoji.emoji(emoji.trim());
          if (response) {
            flag && flag.trim() === 'link'
              ? message.channel.send(response)
              : message.channel.send(new Attachment(response));
          }
        }
      }
    } catch (error) {
      // if something blows up, bot doesn't crash
      error.status = error.status || 500;
      message.channel.send(`\`Error ${error.status}: ${error.message}\``);
    }
  },
);

client.on('messageDelete', (message: Message) => {
  // add it to the messageLog class via method
  try {
    // Ignores Bot messages and DMs
    if (!message.author.bot && message.guild) {
      MessageLog.addDeleted(message);
    }
  } catch (error) {}
});

client.login(TOKEN);
