import db from '../db';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD } from '../helpers/fMessage';
import { SendMsgEmbed, DiscordEmbed, DiscordMessage, MethodMap, ResponseMap } from '../types';

// named as such so as to not cause confusion with Discord.js's emoji class
class CustomEmoji {
    static responseMap: ResponseMap = {
        add: 'Adds an emoji to the store.',
        list: 'Shows the list of emojis.',
        delete: 'Deletes an emoji from the store.',
    };
    static methodMap: MethodMap = {
        help: CustomEmoji.responseMap,
        add: CustomEmoji.addEmoji,
        list: CustomEmoji.getEmojiList,
        delete: CustomEmoji.deleteEmoji,
    };

    // returns all the callable emojis for use with the --emoji syntax
    static async getEmojiList(message: DiscordMessage): Promise<SendMsgEmbed> {
        let result: any = await db.query(`SELECT name FROM emojis`);
        let embed: DiscordEmbed = new RichEmbed()
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
    static async addEmoji(message: DiscordMessage): Promise<string | void> {
        let newEmoji: string[] = message.noPrefix.split(' ');
        let result: { rows: object[] } = await db.query(`SELECT name, image FROM emojis WHERE name = $1`, [
            newEmoji[0],
        ]);
        if (result.rows[0]) {
            // update emoji with new image
            let response: any = await db.query(`UPDATE emojis SET image = $1 WHERE name = $2 RETURNING name`, [
                newEmoji[1],
                newEmoji[0],
            ]);
            return `\`Updated the ${response.rows[0].name} emoji.\``;
        } else {
            // Add the emoji
            let response: any = await db.query(`INSERT INTO emojis (name, image) VALUES ($1, $2)  RETURNING name`, [
                newEmoji[0],
                newEmoji[1],
            ]);
            return `\`Added the ${response.rows[0].name} emoji.\``;
        }
    }

    // deletes an emoji from the database. requires the name of the emoji
    static async deleteEmoji(message: DiscordMessage): Promise<string> {
        let result: any = await db.query(`DELETE FROM emojis WHERE name = $1 RETURNING name`, [message.noPrefix]);
        if (result.rows[0]) return `\`Deleted emoji ${result.rows[0].name}\``;
        throw createError(`Could not find emoji named ${message.noPrefix}.`, 404);
    }

    // this command is accessed with a different syntax than normal commands.
    // Do not add this method to the methodMap
    static async emoji(name: string): Promise<string> {
        let result: any = await db.query(`SELECT image FROM emojis WHERE name = $1`, [name]);
        let foundEmoji: { image: string } = result.rows[0];
        if (!foundEmoji) {
            throw createError(`Could not find emoji ${name}. Check to see if you spelled it correctly`, 404);
        }
        return foundEmoji.image;
    }
}
export default CustomEmoji;
