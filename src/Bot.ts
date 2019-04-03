import { HELP_RESPONSES } from './responses';
import CustomEmoji from './models/Emoji';
import Misc from './models/Misc';
type MethodMap = { [name: string]: (arg0: any) => void };

class Bot {
    // maps the triggering command to the method
    // commands are in the form <Prefix>[key]
    private static methodMap: MethodMap = {
        help: Bot.helpWanted,
        flip: Misc.flip,
        roll: Misc.dieRoll,
        '8': Misc.eightBall,
        add: CustomEmoji.addEmoji,
        delete: CustomEmoji.deleteEmoji,
        emoji: CustomEmoji.getEmojiList,
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    static async commandCenter(message: any): Promise<string | void> {
        let messageParts: string[] = message.content
            .trim()
            .toLowerCase()
            .slice(1)
            .split(' ');

        if (Bot.methodMap.hasOwnProperty(messageParts[0])) {
            let action: any = Bot.methodMap[messageParts[0]];
            // calls method with first argument containing the rest of the message
            // >8 what is life? -> action('what is life?'), where action is the function from the methodMap
            return await action(messageParts.slice(1).join(' '));
        } else return;
    }

    // Displays all available commands from the bot
    private static helpWanted(): string {
        let response: string = '';
        let noDescription: string = 'No description provided.';
        for (let key in Bot.methodMap) {
            response += `${key}: ${HELP_RESPONSES[key] || noDescription}\n`;
        }
        return response;
    }
}

export default Bot;
