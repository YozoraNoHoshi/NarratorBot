import { DiscordEmbed, SendMsgEmbed, DiscordMessage } from '../types';
import { RichEmbed } from 'discord.js';
import client from '../client';

class MessageLog {
    private static _messageLog: DiscordMessage[] = [];

    static addDeleted(message: DiscordMessage) {
        MessageLog._messageLog.push(message);
    }

    static clearLog(toBeCleared: DiscordMessage[]): void {
        let messageIds = new Set(toBeCleared.map(message => message.id));
        MessageLog._messageLog = MessageLog._messageLog.filter(message => !messageIds.has(message.id));
    }

    static restoreMessages(message: DiscordMessage): SendMsgEmbed {
        let toBeRestored: number = Math.min(MessageLog._messageLog.length, 25);
        let log: DiscordMessage[] = MessageLog._messageLog
            .filter(loggedMessages => message.channel === loggedMessages.channel)
            .splice(0, toBeRestored);
        MessageLog.clearLog(log);
        let embed: DiscordEmbed = new RichEmbed()
            .setTitle('Message Log')
            .setDescription(`${toBeRestored} recently deleted messages`)
            .setColor('#2F4F4F')
            .setTimestamp();
        for (let message of log) {
            embed.addField(`${message.author.username} - ${message.createdAt.toDateString()}`, `${message.content}`);
        }
        return { embed };
    }
}

export default MessageLog;
