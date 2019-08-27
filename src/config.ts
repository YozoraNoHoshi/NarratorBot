// Not needed if the bot is started via npm start.
// require('dotenv').config();

// The prefix used to trigger commands
export const BOT_PREFIX: string = '$';
export const EMOJI_PREFIX: string = '--';
export const EMOJI_SUFFIX: string = '';
// The token for the bot user - Requires a bot from discord's developer portal
// DO NOT HARDCODE THE TOKEN HERE. STORE IT IN .ENV
export const TOKEN: string | undefined = process.env.token;
export const DB_URI: string = process.env.NODE_ENV === 'test' ? 'nfubot-test' : process.env.DB_URI || 'nfubot';
export const DB_NAME: string = process.env.DB_NAME || 'nfubotstore'