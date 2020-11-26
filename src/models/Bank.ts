import admin from '../firebase';
import { MethodMap, PrefixedMessage } from '../types';
import { getUserDisplayName } from '../helpers';

export async function checkBalance(message: PrefixedMessage): Promise<string | null> {
  const doc = await admin.firestore().collection('users').doc(message.author.id).get();
  const credits = doc.get('credits') || 0;
  const name = getUserDisplayName(message.author.id, message);
  return `${name} has ${credits} credits.`;
}

const BankMethods: MethodMap = {
  bal: checkBalance,
};

export default BankMethods;
