import { HELP_RESPONSES } from '../responses';
import CustomEmoji from './Emoji';
import Misc from './Misc';
import { MethodMap, BotCommand, SendMsgEmbed, DiscordEmbed, DiscordMessage } from '../types';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import { BOT_PREFIX } from '../config';
import PvP from './PvP';

class Bot {
    // maps the triggering command to the method, or to a sub-MethodMap for nested menus
    // commands are in the form <Prefix>[key]
    private static methodMap: MethodMap = {
        help: Bot.helpWanted,
        flip: Misc.flip,
        roll: Misc.dieRoll,
        '8': Misc.eightBall,
        lie: Misc.thatWasALie,
        add: CustomEmoji.addEmoji,
        delete: CustomEmoji.deleteEmoji,
        emoji: CustomEmoji.getEmojiList,
        duel: PvP.duel,
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    // Pass in your own method map to use a different set of commands, useful for nested menus
    static async commandCenter(
        message: any,
        methodMap: MethodMap = Bot.methodMap,
    ): Promise<string | void | SendMsgEmbed> {
        let messageParts: string[] = message.noPrefix.trim().split(' ');
        let command = messageParts[0].toLowerCase();
        if (methodMap.hasOwnProperty(command)) {
            let action: BotCommand = methodMap[command];
            // let restOfMessage: string = messageParts.slice(1).join(' ');
            message.noPrefix = messageParts.slice(1).join(' ');
            // Recursively calls command center for processing submenu actions.
            // NOTE - This really should be a type guard to check that it is of type MethodMap
            if (action === Bot.helpWanted) {
                return Bot.helpWanted(message, methodMap);
            } else if (typeof action !== 'function') {
                return await Bot.commandCenter(message, action);
            }
            // >8 what is life? -> action('what is life?'), where action is the function from the methodMap
            return await action(message);
        } else return;
    }

    // Displays all available commands from the bot
    // Maybe should recursively display submenus as well...
    private static helpWanted(message: DiscordMessage, methodMap: MethodMap): SendMsgEmbed {
        let embed: DiscordEmbed = new RichEmbed()
            .setTitle(`${fMessage('Available Commands', BOLD)}`)
            .setColor('#00CED1')
            .setDescription(`Commands should be prefixed with '${BOT_PREFIX}'`)
            .setTimestamp();
        let noDescription: string = 'No description provided.';
        for (let key in methodMap) {
            // Should not only be from the help_responses object, should be dynamic somehow
            embed.addField(`${fMessage(key, BOLD)}`, fMessage(HELP_RESPONSES[key] || noDescription, ITALICS));
        }
        return { embed };
    }
}

export default Bot;
