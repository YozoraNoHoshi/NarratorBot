import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const addUserCredits = functions.pubsub.schedule('0 0 * * *').onRun(async () => {
  const batch = admin.firestore().batch();

  const snap = await admin
    .firestore()
    .collection('users')
    .get();

  snap.forEach(d => batch.update(d.ref, { credits: admin.firestore.FieldValue.increment(100) }));

  await batch.commit();
});
