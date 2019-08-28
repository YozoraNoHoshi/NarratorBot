import db from '../db';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD } from '../helpers/fMessage';
import { SendMsgEmbed, MethodMap, ResponseMap, PrefixedMessage } from '../types';
import { EMOJI_PREFIX, EMOJI_SUFFIX } from '../config';

type CreateEmbedFunction = {
  (): RichEmbed;
  (i: number, numEmbeds: number): RichEmbed;
};

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
  static async getEmojiList(message: PrefixedMessage): Promise<SendMsgEmbed | SendMsgEmbed[]> {
    const mongodb = await db;
    let result = await mongodb
      .collection('emojis')
      .find({})
      .toArray();

    let numEmbeds = Math.ceil(result.length / 25);

    return CustomEmoji.emojiListCreateEmbeds(result, numEmbeds)
  }


  private static emojiListCreateEmbeds(result: any[], numEmbeds: number = 0): SendMsgEmbed | SendMsgEmbed[] {
    const createEmbed: CreateEmbedFunction = (i?: number, numEmbeds?: number) => {
      let embed = new RichEmbed()
        .setTitle(`${fMessage('Available Emoji', BOLD)}`)
        .setColor('#00CED1')
        .setTimestamp();
      if (i === undefined || i === 0) embed.setDescription(`Use an emoji with '${EMOJI_PREFIX}EMOJI${EMOJI_SUFFIX}`);
      else embed.setDescription(`Page ${i + 1} of ${numEmbeds}`);
      return embed;
    };

    if (numEmbeds > 1) {
      const embeds = Array.from({ length: numEmbeds }, (v, k) => {return {embed: createEmbed(k, numEmbeds)}});
      let currentEmbedIndex = 0;
      let currentEmbedCount = 0;
      for (let emojiObj of result) {
        embeds[currentEmbedIndex].embed.addField(emojiObj.name, emojiObj.image);
        currentEmbedCount += 1;

        if (currentEmbedCount >= 25) {
          currentEmbedIndex += 1;
          currentEmbedCount = 0;
        }
      }
      return embeds
    } else {
      let embed = createEmbed();
      for (let emojiObj of result) {
        embed.addField(emojiObj.name, emojiObj.image);
      }
      return { embed };
    }
  }

  // adds an emoji to the database. requires arguments in the form '<name> <url>'
  static async addEmoji(message: PrefixedMessage): Promise<string | void> {
    let newEmoji: string[] = message.noPrefix.split(' ');
    const mongodb = await db;
    let result = await mongodb
      .collection('emojis')
      .updateOne({ name: newEmoji[0] }, { $set: { image: newEmoji[1] } }, { upsert: true });
    return result.result.nModified === 1
      ? `\`Updated the ${newEmoji[0]} emoji.\``
      : `\`Added the ${newEmoji[0]} emoji.\``;
  }

  // deletes an emoji from the database. requires the name of the emoji
  static async deleteEmoji(message: PrefixedMessage): Promise<string> {
    const mongodb = await db;
    let result = await mongodb.collection('emojis').deleteOne({ name: message.noPrefix });

    const { deletedCount } = result;
    if (deletedCount === 1) return `\`Deleted emoji ${message.noPrefix}\``;
    throw createError(`Could not find emoji named ${message.noPrefix}.`, 404);
  }

  // this command is accessed with a different syntax than normal commands.
  // Do not add this method to the methodMap
  static async emoji(name: string): Promise<string> {
    const mongodb = await db;
    let result: any = await mongodb
      .collection('emojis')
      .find({ name })
      .toArray();
    let foundEmoji: { image: string } = result[0];
    if (!foundEmoji) {
      throw createError(`Could not find emoji ${name}. Check to see if you spelled it correctly`, 404);
    }
    return foundEmoji.image;
  }
}
export default CustomEmoji;
