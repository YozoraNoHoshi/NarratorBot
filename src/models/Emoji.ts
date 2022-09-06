// import db from '../db';
import createError from '../helpers/createError';
import { EmbedBuilder } from 'discord.js';
import fMessage, { BOLD } from '../helpers/fMessage';
import { SendMsgEmbed, MethodMap, ResponseMap, PrefixedMessage } from '../types';
import { EMOJI_PREFIX, EMOJI_SUFFIX } from '../config';
import admin from '../firebase';
import { emoji } from '../helpers';

type CreateEmbedFunction = {
  (): EmbedBuilder;
  (i: number, numEmbeds: number): EmbedBuilder;
};

const PROTECTED_EMOJI_LIST: Set<string> = new Set(['shi']);

export const EMOJI_RESPONSE_LIST: ResponseMap = {
  add: 'Adds an emoji to the store.',
  list: 'Shows the list of emojis.',
  delete: 'Deletes an emoji from the store.',
};
export const EMOJI_METHOD_MAP: MethodMap = {
  help: EMOJI_RESPONSE_LIST,
  add: addEmoji,
  list: getEmojiList,
  delete: deleteEmoji,
};

async function getEmojiList(message: PrefixedMessage): Promise<SendMsgEmbed | SendMsgEmbed[]> {
  const emojiSnap = await admin.firestore().collection('emojis').get();
  const numEmbeds = Math.ceil(emojiSnap.size / 25);

  return emojiListCreateEmbeds(emojiSnap, numEmbeds);
}

function emojiListCreateEmbeds(
  snap: FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>,
  numEmbeds: number = 0,
): SendMsgEmbed | SendMsgEmbed[] {
  const result = snap.docs;
  const createEmbed: CreateEmbedFunction = (i?: number, numEmbeds?: number) => {
    let embed = new EmbedBuilder()
      .setTitle(`${fMessage('Available Emoji', BOLD)}`)
      .setColor('#00CED1')
      .setTimestamp();
    if (i === undefined || i === 0) embed.setDescription(`Use an emoji with '${EMOJI_PREFIX}EMOJI${EMOJI_SUFFIX}'`);
    else embed.setDescription(`Page ${i + 1} of ${numEmbeds}`);
    return embed;
  };

  if (numEmbeds > 1) {
    const embeds = Array.from({ length: numEmbeds }, (v, k) => createEmbed(k, numEmbeds));
    let currentEmbedIndex = 0;
    let currentEmbedCount = 0;
    for (let emojiObj of result) {
      embeds[currentEmbedIndex].addFields({ name: emojiObj.get('name'), value: emojiObj.get('image') });
      currentEmbedCount += 1;

      if (currentEmbedCount >= 25) {
        currentEmbedIndex += 1;
        currentEmbedCount = 0;
      }
    }
    return { embeds };
  } else {
    let embed = createEmbed();
    for (let emojiObj of result) {
      embed.addFields({ name: emojiObj.get('name'), value: emojiObj.get('image') });
    }
    return { embeds: [embed] };
  }
}

async function addEmoji(message: PrefixedMessage): Promise<string | void> {
  // if (message.author.id !== ADMIN_USER_ID) return admin401Response(message);

  let newEmoji: string[] = message.noPrefix.split(' ');

  if (PROTECTED_EMOJI_LIST.has(newEmoji[0])) return `${emoji('derpypeek', message)} I bet you thought that'd work.`;

  await admin.firestore().collection('emojis').doc(newEmoji[0]).set({ image: newEmoji[1], name: newEmoji[0] });

  return `\`Added the ${newEmoji[0]} emoji.\``;
}

// deletes an emoji from the database. requires the name of the emoji
async function deleteEmoji(message: PrefixedMessage): Promise<string> {
  // if (message.author.id !== ADMIN_USER_ID) return admin401Response(message);
  if (PROTECTED_EMOJI_LIST.has(message.noPrefix)) return `${emoji('bolb', message)} This emoji never existed.`;
  try {
    await admin.firestore().collection('emojis').doc(message.noPrefix).delete();

    return `\`Deleted emoji ${message.noPrefix}\``;
  } catch (error) {
    throw createError(`Could not find emoji named ${message.noPrefix}.`, 404);
  }
}

// this command is accessed with a different syntax than normal commands.
// Do not add this method to the methodMap
export async function retrieveEmoji(name: string): Promise<string> {
  let result = await admin.firestore().collection('emojis').doc(name).get();

  if (!result.exists) {
    throw createError(`Could not find emoji ${name}. Check to see if you spelled it correctly`, 404);
  }

  return result.get('image');
}
