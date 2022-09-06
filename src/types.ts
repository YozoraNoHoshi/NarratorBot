import { Message, EmbedBuilder } from 'discord.js';

// Either a function or another MethodMap which indicates a submenu
export type MethodMap = { [name: string]: BotCommand };
export type ResponseMap = { [name: string]: string };
export type CommandFunction = (arg0: PrefixedMessage, arg1?: any) => any;
export type BotCommand = CommandFunction | MethodMap | ResponseMap;

export type Player = { username: string; hp: number };

export type SendMsgEmbed = { embeds: EmbedBuilder[] };
export type DeletedMessage = { deleted: boolean };
export type PrefMessage = { noPrefix: string };
export type PrefixedMessage = Message & PrefMessage;
