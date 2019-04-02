import { EIGHT_BALL_RESPONSES, FLIP_RESPONSES, HELP_RESPONSES } from './responses';
import randomChoice from './helpers/randomChoice';
import db from './db';
import createError from './helpers/createError';
type MethodMap = { [name: string]: (arg0: any) => void };

class Bot {
    // maps the triggering command to the method
    // commands are in the form <Prefix>[key]
    private static methodMap: MethodMap = {
        help: Bot.helpWanted,
        flip: Bot.flip,
        roll: Bot.dieRoll,
        '8': Bot.eightBall,
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    static commandCenter(message: any): string | void {
        let messageParts: string[] = message.content
            .trim()
            .slice(1)
            .split(' ');

        if (Bot.methodMap.hasOwnProperty(messageParts[0])) {
            let action: any = Bot.methodMap[messageParts[0]];
            // calls method with first argument containing the rest of the message
            // >8 what is life? -> action('what is life?')
            return action(messageParts.slice(1).join(' '));
        } else return;
    }

    private static helpWanted(): string {
        let response: string = '';
        let noDescription: string = 'No description provided.';
        for (let key in Bot.methodMap) {
            response += `${key}: ${HELP_RESPONSES[key] || noDescription}\n`;
        }
        return response;
    }

    // returns the 8 ball response for the question
    private static eightBall(message: string): string {
        if (!message.endsWith('?')) return "That doesn't look like a question.";
        return randomChoice(EIGHT_BALL_RESPONSES);
    }

    // flips a two sided coin and returns the result
    private static flip(): string {
        return randomChoice(FLIP_RESPONSES);
    }

    private static dieRoll(sides: string = '6'): string {
        let input: number = Number(sides);
        if (isNaN(input)) return `You can't roll a ${sides}-sided die!`;
        let result = Math.ceil(Math.random() * input);
        return `You rolled a ${result}!`;
    }
    // this command is accessed with a different syntax than normal commands.
    // Do not add this method to the methodMap
    static async emoji(name: string): Promise<string> {
        let result = await db.query(`SELECT image FROM emojis WHERE name = $1`, [name]);
        let foundEmoji = result.rows[0];
        if (!foundEmoji) {
            throw createError(`Could not find emoji ${name}. Check to see if you spelled it correctly`, 404);
        }
        return foundEmoji.image;
    }
}

export default Bot;
