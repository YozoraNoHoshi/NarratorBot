// import discord = require('discord.js');
import { TOKEN, BOT_PREFIX, EMOJI_PREFIX, EMOJI_SUFFIX, EXTRA_FLAGS } from './config';
import { PrefixedMessage, SendMsgEmbed } from './types';
import Bot from './models/Bot';
import { retrieveEmoji } from './models/Emoji';
import client from './client';
import { ActivityType, Events } from 'discord.js';
import { addDeleted } from './models/MessageLog';

const emojiRegex = new RegExp(`^(${EMOJI_PREFIX})(\\w+)(${EMOJI_SUFFIX})?(\\s)?(${EXTRA_FLAGS}[a-z]+)?`);

client.on(Events.ClientReady, () => {
  console.log('Drain your glass!');
  client.user!.setActivity(process.env.ACTIVITY_LABEL || 'anime.', { type: ActivityType.Watching });
});

client.on(Events.MessageCreate, async (rawMessage): Promise<void> => {
  const message: PrefixedMessage = rawMessage as PrefixedMessage;
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
      else if (message.content.match(emojiRegex)) {
        let [content, flag] = message.content.split(EXTRA_FLAGS);
        let end: number = -EMOJI_SUFFIX.length || content.length;
        let emoji = content.trim().slice(EMOJI_PREFIX.length, end);
        let response: string | void = await retrieveEmoji(emoji.trim(), message);
        if (response) {
          message.channel.send(response);
          // flag && flag.trim() === 'link'
          // ? message.channel.send(response)
          // : message.channel.send(new Attachment(response));
        }
      }
    }
  } catch (error: any) {
    // if something blows up, bot doesn't crash
    error.status = error.status || 500;
    message.channel.send(`\`Error ${error.status}: ${error.message}\``);
  }
});

client.on(Events.MessageDelete, (message) => {
  // add it to the messageLog class via method
  try {
    // Ignores Bot messages and DMs
    if (!message.author?.bot && message.guild) {
      addDeleted(message);
    }
  } catch (error) {}
});

client.login(TOKEN);
