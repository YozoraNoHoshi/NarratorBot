import db from '../db';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD } from '../helpers/fMessage';
import { SendMsgEmbed } from '../types';

// named as such so as to not cause confusion with Discord.js's emoji class
class CustomEmoji {
    // returns all the callable emojis for use with the [<emoji>] syntax
    static async getEmojiList(restOfMessage: string, message: any): Promise<SendMsgEmbed> {
        let result = await db.query(`SELECT name FROM emojis`);
        let embed = new RichEmbed()
            .setTitle(`${fMessage('Available Emoji', BOLD)}`)
            .setColor('#00CED1')
            .setDescription(`Use an emoji with '[EMOJI]`)
            .setTimestamp();
        for (let emojiObj of result.rows) {
            embed.addField(emojiObj.name, '');
        }
        return { embed };
    }

    // adds an emoji to the database. requires arguments in the form '<name> <url>'
    static async addEmoji(entry: string): Promise<string | void> {
        let newEmoji: string[] = entry.split(' ');
        let result = await db.query(`SELECT name, image FROM emojis WHERE name = $1`, [newEmoji[0]]);
        if (result.rows[0]) {
            // update emoji with new image
            let response = await db.query(`UPDATE emojis SET image = $1 WHERE name = $2 RETURNING name`, [
                newEmoji[1],
                newEmoji[0],
            ]);
            return `\`Updated the ${response.rows[0].name} emoji.\``;
        } else {
            // Add the emoji
            let response = await db.query(`INSERT INTO emojis (name, image) VALUES ($1, $2)  RETURNING name`, [
                newEmoji[0],
                newEmoji[1],
            ]);
            return `\`Added the ${response.rows[0].name} emoji.\``;
        }
    }

    // deletes an emoji from the database. requires the name of the emoji
    static async deleteEmoji(name: string): Promise<string> {
        let result = await db.query(`DELETE FROM emojis WHERE name = $1 RETURNING name`, [name]);
        if (result.rows[0]) return `\`Deleted emoji ${result.rows[0].name}\``;
        throw createError(`Could not find emoji named ${name}.`, 404);
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
export default CustomEmoji;
