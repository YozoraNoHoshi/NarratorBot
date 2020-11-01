import * as admin from 'firebase-admin';

const FIREBASE_CONFIG = JSON.parse(process.env.FIREBASE_CONFIG!);

admin.initializeApp({
  credential: admin.credential.cert(FIREBASE_CONFIG),
  databaseURL: 'https://narrator-bot.firebaseio.com',
});

export default admin;
