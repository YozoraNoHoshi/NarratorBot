import { SendMsgEmbed, PrefixedMessage } from '../types';
import { MessageEmbed, Message, PartialMessage } from 'discord.js';
import admin from '../firebase';

const DELETED_MESSAGES_COLLECTION = process.env.NODE_ENV === 'test' ? 'deleted-messages-test' : 'deleted-messages';

export async function addDeleted(message: Message | PartialMessage): Promise<void> {
  let fieldContent =
    message.content || (message.embeds.length > 0 && 'Embedded Message') || 'Failed to retrieve message contents.';

  await admin.firestore().collection(DELETED_MESSAGES_COLLECTION).doc().set({
    channel: message.channel.id,
    server: message.guild!.id,
    fieldContent,
    authorTag: message.author!.tag,
    authorId: message.author!.id,
    authorDiscriminator: message.author!.discriminator,
    id: message.id,
    messageTime: message.createdAt.toDateString(),
    timestamp: message.createdAt.getTime(),
  });
}

export async function clearLog(channelId: string): Promise<void> {
  try {
    const snap = await admin
      .firestore()
      .collection(DELETED_MESSAGES_COLLECTION)
      .where('channel', '==', channelId)
      .get();
    const batch = admin.firestore().batch();
    snap.forEach((d) => batch.delete(d.ref));
    await batch.commit();
  } catch (error) {
    console.error(error, channelId);
    throw new Error('Error clearing the recent message log');
  }
}

export async function restoreMessages(message: PrefixedMessage): Promise<SendMsgEmbed> {
  try {
    const log = await admin
      .firestore()
      .collection(DELETED_MESSAGES_COLLECTION)
      .where('channel', '==', message.channel.id)
      .orderBy('timestamp', 'desc')
      .limit(25)
      .get();

    let embed: MessageEmbed = new MessageEmbed()
      .setTitle('Message Log')
      .setDescription(`${log.size} recently deleted messages`)
      .setColor('#2F4F4F')
      .setTimestamp();

    const batch = admin.firestore().batch();

    log.docs.forEach((d) => {
      const fieldContent = d.get('fieldContent');
      embed.addField(`${d.get('authorTag')} - ${d.get('messageTime')}`, `${fieldContent}`);
      batch.delete(d.ref);
    });

    await batch.commit();

    return { embed };
  } catch (error) {
    console.error(error, message.channel.id);
    throw new Error('Error restoring the recent messages');
  }
}
