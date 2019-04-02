// require('dotenv').config();

export const TOKEN: string | undefined = process.env.token;

export const BOT_PREFIX: string = '!';

export const DB_URI: string = process.env.DB_URI || 'nfubot';
