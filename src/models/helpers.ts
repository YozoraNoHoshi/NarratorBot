import { Message } from "discord.js";
import { PrefixedMessage } from "../types";

export function getUserDisplayName(id: string | number,message: PrefixedMessage | Message): string {
  return message.guild.members.find(u => u.id === id)?.displayName
}

export function getEmojiString(name: string, message: PrefixedMessage | Message): string {
  return message.guild.emojis.find(e => e.name=== name)?.toString()
}