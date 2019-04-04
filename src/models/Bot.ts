import { HELP_RESPONSES } from '../responses';
import CustomEmoji from './Emoji';
import Misc from './Misc';
import { MethodMap, BotCommand } from '../types';

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
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    // Pass in your own method map to use a different set of commands, useful for nested menus
    static async commandCenter(message: any, methodMap: MethodMap = Bot.methodMap): Promise<string | void> {
        let messageParts: string[] = message.noPrefix.trim().split(' ');
        let command = messageParts[0].toLowerCase();
        if (methodMap.hasOwnProperty(command)) {
            let action: BotCommand = methodMap[command];
            let restOfMessage: string = messageParts.slice(1).join(' ');
            // Recursively calls command center for processing submenu actions.
            // NOTE - This really should be a type guard to check that it is of type MethodMap
            // if (typeof action !== 'function') {
            //     message.noPrefix = restOfMessage;
            //     return await Bot.commandCenter(message, action);
            // }
            // >8 what is life? -> action('what is life?'), where action is the function from the methodMap
            return await action(restOfMessage);
        } else return;
    }

    // Displays all available commands from the bot
    private static helpWanted(): string {
        let response: string = '**__Available Commands__**';
        let noDescription: string = 'No description provided.';
        for (let key in Bot.methodMap) {
            response += `**${key}**: _${HELP_RESPONSES[key] || noDescription}_\n`;
        }
        return response;
    }
}

export default Bot;
