import { Message } from 'discord.js';
import { PrefixedMessage } from '../types';

export function getUserDisplayName(id: string, message: PrefixedMessage | Message): string | undefined {
  return message.guild?.member(id)?.displayName;
}

export function getEmojiString(name: string, message: PrefixedMessage | Message): string | undefined {
  return message.guild?.emojis.cache.find((e) => e.name === name)?.toString();
}

export function emoji(name: string, message: PrefixedMessage | Message) {
  return message.guild?.emojis.resolve(name)?.toString() || '';
}
