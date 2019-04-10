import { RichEmbed } from 'discord.js';
import { MethodMap, BotCommand, SendMsgEmbed, DiscordEmbed, DiscordMessage } from '../types';
import { HELP_RESPONSES } from '../responses';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import { BOT_PREFIX } from '../config';
import CustomEmoji from './Emoji';
import Misc from './Misc';
import PvP from './PvP';
import MessageLog from './MessageLog';
import Anime from './Anime';

class Bot {
    // maps the triggering command to the method, or to a sub-MethodMap for nested menus
    // commands are in the form <Prefix>[key]
    private static methodMap: MethodMap = {
        // help: Bot.helpWanted,
        flip: Misc.flip,
        roll: Misc.dieRoll,
        '8': Misc.eightBall,
        lie: Misc.thatWasALie,
        duel: PvP.duel,
        log: MessageLog.restoreMessages,
        emoji: CustomEmoji.methodMap,
        anime: Anime.methodMap,
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    // Pass in your own method map to use a different set of commands, useful for nested menus
    static async commandCenter(
        message: DiscordMessage,
        methodMap: MethodMap = Bot.methodMap,
    ): Promise<string | void | SendMsgEmbed> {
        let messageParts: string[] = message.noPrefix.trim().split(' ');
        let command: string = messageParts[0].toLowerCase();
        if (command === 'help') {
            return await Bot.helpWanted(message, methodMap);
        }
        if (methodMap.hasOwnProperty(command)) {
            let action: BotCommand = methodMap[command];
            // let restOfMessage: string = messageParts.slice(1).join(' ');
            message.noPrefix = messageParts.slice(1).join(' ');
            // Recursively calls command center for processing submenu actions.
            // NOTE - This really should be a type guard to check that it is of type MethodMap
            // if (action === Bot.helpWanted) {
            if (typeof action !== 'function') {
                return await Bot.commandCenter(message, action);
            }
            // >8 what is life? -> action('what is life?'), where action is the function from the methodMap
            return await action(message);
        } else return;
    }

    // Displays all available commands from the bot
    // Maybe should recursively display submenus as well...
    private static helpWanted(
        message: DiscordMessage,
        methodMap: MethodMap,
        responseMap: any = HELP_RESPONSES,
    ): SendMsgEmbed {
        let embed: DiscordEmbed = new RichEmbed()
            .setTitle(`${fMessage('Available Commands', BOLD)}`)
            .setColor('#00CED1')
            .setDescription(`Commands should be prefixed with '${BOT_PREFIX}'`)
            .setTimestamp();
        let noDescription: string = 'No description provided.';
        for (let key in methodMap) {
            // Should not only be from the help_responses object, should be dynamic somehow
            if (typeof responseMap[key] === 'string') {
                embed.addField(`${fMessage(key, BOLD)}`, fMessage(responseMap[key] || noDescription, ITALICS));
            } else {
                embed.addField(`${fMessage(key, BOLD)}`, fMessage(`${key} has its own submenu`, ITALICS));
            }
        }
        return { embed };
    }
}

export default Bot;
