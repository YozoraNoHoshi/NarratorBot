import { EmbedBuilder } from 'discord.js';
import { MethodMap, BotCommand, SendMsgEmbed, ResponseMap, PrefixedMessage } from '../types';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import { ADMIN_USER_ID, BOT_PREFIX } from '../config';
import { EMOJI_METHOD_MAP } from './Emoji';
import Misc from './Misc';
import PvP from './PvP';
import Anime from './Anime';
import { restoreMessages } from './MessageLog';
import AdminMethods from './Admin';
import BankMethods from './Bank';
import { emoji } from '../helpers';
import ApexLegendsCommands from './Apex';

class Bot {
  private static responseMap: ResponseMap = {
    flip: 'Flips a coin.',
    roll: 'Rolls a X sided die. Default 6. A second parameter can be added to specify the number of sides.',
    '8': 'Asks the magic 8 ball a question. Questions must end in "?"',
    duel: 'Initiates a duel against the first mentioned user. Users cannot be bots, except for me. Just try it.',
    log: 'Displays recently deleted messages. I like being evil.',
  };

  // maps the triggering command to the method, or to a sub-MethodMap for nested menus
  // commands are in the form <Prefix>[key]
  private static methodMap: MethodMap = {
    help: Bot.responseMap,
    flip: Misc.flip,
    roll: Misc.dieRoll,
    '8': Misc.eightBall,
    lie: Misc.thatWasALie,
    duel: PvP.duel,
    log: restoreMessages,
    emoji: EMOJI_METHOD_MAP,
    anime: Anime.methodMap,
    admin: AdminMethods,
    bank: BankMethods,
    apex: ApexLegendsCommands.methodMap,
  };

  // This method allows for dynamic calling of other methods based on the incoming message.
  // Pass in your own method map to use a different set of commands, useful for nested menus
  static async commandCenter(
    message: PrefixedMessage,
    methodMap: MethodMap = Bot.methodMap,
  ): Promise<string | void | SendMsgEmbed | string[] | SendMsgEmbed[]> {
    let messageParts: string[] = message.noPrefix.trim().split(' ');
    let command: string = messageParts[0].toLowerCase();
    // console.log('command:', command)
    if (command === 'help') {
      return await Bot.helpWanted(message, methodMap, methodMap.help);
    }
    if (command === 'admin' && message.author.id !== ADMIN_USER_ID) {
      const resEmoji = emoji('sipglare', message);
      return `Who tf are you ${resEmoji}`;
    }
    if (methodMap.hasOwnProperty(command)) {
      // Action is of type BotCommand. Any is there for the case where "help" is triggered, which is handled above.
      let action: BotCommand | any = methodMap[command];
      message.noPrefix = messageParts.slice(1).join(' ');
      // Recursively calls command center for processing submenu actions.
      // NOTE - This really should be a type guard to check that it is of type MethodMap
      if (typeof action !== 'function') {
        return await Bot.commandCenter(message, action);
      }
      return await action(message);
    } else return;
  }

  // Displays all available commands from the bot for the current submenu
  private static helpWanted(
    message: PrefixedMessage,
    methodMap: MethodMap,
    responseMap: any = Bot.responseMap,
  ): SendMsgEmbed {
    let embed: EmbedBuilder = new EmbedBuilder()
      .setTitle(`${fMessage('Available Commands', BOLD)}`)
      .setColor('#00CED1')
      .setDescription(`Commands should be prefixed with '${BOT_PREFIX}'`)
      .setTimestamp();
    let noDescription: string = 'No description provided.';
    for (let key in methodMap) {
      if (key !== 'help' && key !== 'admin') {
        let desc: string =
          typeof responseMap[key] === 'string' ? responseMap[key] || noDescription : `${key} has its own submenu`;

        embed.addFields({ name: fMessage(key, BOLD), value: fMessage(desc, ITALICS) });
      }
    }
    return { embeds: [embed] };
  }
}

export default Bot;
