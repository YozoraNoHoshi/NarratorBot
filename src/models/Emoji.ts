import db from '../db';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD } from '../helpers/fMessage';
import { SendMsgEmbed, MethodMap, ResponseMap, PrefixedMessage } from '../types';
import { EMOJI_PREFIX, EMOJI_SUFFIX } from '../config';

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
  static async getEmojiList(message: PrefixedMessage): Promise<SendMsgEmbed> {
    const mongodb = await db
    let result: any = await mongodb
      .collection('emojis')
      .find({})
      .toArray();
    let embed: RichEmbed = new RichEmbed()
      .setTitle(`${fMessage('Available Emoji', BOLD)}`)
      .setColor('#00CED1')
      .setDescription(`Use an emoji with '${EMOJI_PREFIX}EMOJI${EMOJI_SUFFIX}`)
      .setTimestamp();
    // for (let emojiObj of result.rows) {
    for (let emojiObj of result) {
      embed.addField(emojiObj.name, '');
    }
    return { embed };
  }

  // adds an emoji to the database. requires arguments in the form '<name> <url>'
  static async addEmoji(message: PrefixedMessage): Promise<string | void> {
    let newEmoji: string[] = message.noPrefix.split(' ');
    const mongodb = await db
    let result: any = await mongodb
      .collection('emojis')
      .update({ name: newEmoji[0] }, { $set: { image: newEmoji[1] } }, { upsert: true });
    return result.upsertedCount === 1 ? `\`Updated the ${newEmoji[0]} emoji.\`` : `\`Added the ${newEmoji[0]} emoji.\``;
  }

  // deletes an emoji from the database. requires the name of the emoji
  static async deleteEmoji(message: PrefixedMessage): Promise<string> {
    const mongodb = await db
    let result: any = await mongodb.collection('emojis').deleteOne({name: message.noPrefix})
    if (result.deletedCount === 1) return `\`Deleted emoji ${message.noPrefix}\``;
    throw createError(`Could not find emoji named ${message.noPrefix}.`, 404);
  }

  // this command is accessed with a different syntax than normal commands.
  // Do not add this method to the methodMap
  static async emoji(name: string): Promise<string> {
    const mongodb = await db
    let result: any = await mongodb.collection('emojis').find({name}).toArray()
    let foundEmoji: { image: string } = result[0];
    if (!foundEmoji) {
      throw createError(`Could not find emoji ${name}. Check to see if you spelled it correctly`, 404);
    }
    return foundEmoji.image;
  }
}
export default CustomEmoji;
