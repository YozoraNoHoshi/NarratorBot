import admin from '../firebase';
import { MethodMap, PrefixedMessage } from '../types';
import { emoji, getUserDisplayName } from '../helpers';

export async function checkBalance(message: PrefixedMessage): Promise<string | null> {
  const doc = await admin.firestore().collection('users').doc(message.author.id).get();
  const credits = doc.get('credits') || 0;
  const name = getUserDisplayName(message.author.id, message);

  const creditEmoji = credits > 0 ? emoji('blobderpy', message) : emoji('blobstare', message);
  return `${name} has ${credits} credits ${creditEmoji}`;
}

const BankMethods: MethodMap = {
  bal: checkBalance,
};

export default BankMethods;
