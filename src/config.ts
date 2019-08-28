// Not needed if the bot is started via npm start.
// require('dotenv').config();

// The prefix used to trigger commands
export const BOT_PREFIX: string = process.env.BOT_PREFIX || '$';
export const EMOJI_PREFIX: string = process.env.EMOJI_PREFIX || '--';
export const EMOJI_SUFFIX: string = process.env.EMOJI_SUFFIX || '';
// The token for the bot user - Requires a bot from discord's developer portal
// DO NOT HARDCODE THE TOKEN HERE. STORE IT IN .ENV
export const TOKEN: string | undefined = process.env.token;
export const DB_NAME: string = process.env.NODE_ENV === 'test' ? 'nfubotstoretest' : process.env.DB_NAME || 'nfubotstore'
export const DB_URI: string = process.env.NODE_ENV === 'test' ? `mongodb://localhost:27017/${DB_NAME}TEST` : process.env.MONGODB_URI || process.env.DB_URI || `mongodb://localhost:27017/${DB_NAME}`;