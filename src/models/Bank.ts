import admin from '../firebase';
import { MethodMap, PrefixedMessage } from '../types';
import { getEmojiString, getUserDisplayName } from '../helpers';

export async function checkBalance(message: PrefixedMessage): Promise<string | null> {
  const doc = await admin.firestore().collection('users').doc(message.author.id).get();
  const credits = doc.get('credits') || 0;
  const name = getUserDisplayName(message.author.id, message);

  const creditEmoji = credits > 0 ? getEmojiString('blobderpy', message) : getEmojiString('blobstare', message);
  return `${name} has ${credits} credits ${creditEmoji}`;
}

const BankMethods: MethodMap = {
  bal: checkBalance,
};

export default BankMethods;
