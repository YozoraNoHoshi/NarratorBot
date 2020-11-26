import admin from '../firebase';
import { getEmojiString } from '../helpers';
import { MethodMap, PrefixedMessage } from '../types';

export async function populateUsers(message: PrefixedMessage): Promise<string | undefined> {
  const batch = admin.firestore().batch();
  message.guild?.members.cache.forEach((m) => {
    if (m.user.bot) return;
    const memberObject = {
      id: m.id,
      nickname: m.nickname,
      displayName: m.displayName,
      username: m.user.username,
    };
    const user = admin.firestore().collection('users').doc(m.id);
    batch.set(user, memberObject, { merge: true });
  });
  await batch.commit();
  return getEmojiString('blobderpy', message);
}

export async function addCredits(message: PrefixedMessage): Promise<string | null> {
  const amount: string = message.noPrefix.split(' ').find((s) => !isNaN(+s)) || '100';
  const batch = admin.firestore().batch();
  if (message.mentions.users.size > 0) {
    message.mentions.users.forEach((u) => {
      addCredsToUser(batch, u.id, amount);
    });
  }
  if (message.mentions.roles.size > 0) {
    message.mentions.roles.forEach((r) =>
      r.members.forEach((u) => {
        addCredsToUser(batch, u.id, amount);
      }),
    );
  }
  await batch.commit();

  return `Added ${amount} credits.`;
}

function addCredsToUser(batch: FirebaseFirestore.WriteBatch, userId: string, amount: string) {
  const ref = admin.firestore().collection('users').doc(userId);

  batch.set(ref, { credits: admin.firestore.FieldValue.increment(+amount || 100) }, { merge: true });
}

const AdminMethods: MethodMap = {
  poll: populateUsers,
  ['add-credits']: addCredits,
};

export default AdminMethods;
