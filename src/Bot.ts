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
        add: Bot.addEmoji,
        delete: Bot.deleteEmoji,
        emoji: Bot.getEmojiList,
    };

    // This method allows for dynamic calling of other methods based on the incoming message.
    static async commandCenter(message: any): Promise<string | void> {
        let messageParts: string[] = message.content
            .trim()
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

    // returns the 8 ball response for the question
    private static eightBall(message: string): string {
        if (!message.endsWith('?')) return "That doesn't look like a question.";
        return randomChoice(EIGHT_BALL_RESPONSES);
    }

    // flips a two sided coin and returns the result
    private static flip(): string {
        return randomChoice(FLIP_RESPONSES);
    }

    // rolls a virtual X sided die and returns the result. input must be positive and an actual number
    private static dieRoll(sides: string = '6'): string {
        if (sides.toLowerCase().includes('infinity')) return 'No.';
        let input: number = Number(sides);
        if (isNaN(input)) return `You can't roll a ${sides}-sided die!`;
        if (input < 0) return `Maybe try something higher than ${input}?`;
        let result = Math.ceil(Math.random() * input);
        return `You rolled a ${result}!`;
    }

    // returns all the callable emojis for use with the [<emoji>] syntax
    private static async getEmojiList(): Promise<string> {
        let result = await db.query(`SELECT name FROM emojis`);
        return result.rows.reduce((acc, val) => {
            return acc + `\n${val.name}`;
        }, '');
    }

    // adds an emoji to the database. requires arguments in the form '<name> <url>'
    private static async addEmoji(entry: string): Promise<string | void> {
        let newEmoji: string[] = entry.split(' ');
        let result = await db.query(`SELECT name, image FROM emojis WHERE name = $1`, [newEmoji[0]]);
        if (result.rows[0]) {
            // update emoji with new image
            let response = await db.query(`UPDATE emojis SET image = $1 WHERE name = $2 RETURNING name`, [
                newEmoji[1],
                newEmoji[0],
            ]);
            return `Updated the ${response.rows[0].name} emoji.`;
        } else {
            // Add the emoji
            let response = await db.query(`INSERT INTO emojis (name, image) VALUES ($1, $2)  RETURNING name`, [
                newEmoji[0],
                newEmoji[1],
            ]);
            return `Added the ${response.rows[0].name} emoji.`;
        }
    }

    // deletes an emoji from the database. requires the name of the emoji
    private static async deleteEmoji(name: string): Promise<string> {
        let result = await db.query(`DELETE FROM emojis WHERE name = $1 RETURNING name`, [name]);
        if (result.rows[0]) return `Deleted ${result.rows[0].name}`;
        return `Could not find emoji named ${name}.`;
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
