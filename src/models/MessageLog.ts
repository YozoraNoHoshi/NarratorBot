import { DiscordEmbed, SendMsgEmbed, DiscordMessage } from '../types';
import { RichEmbed } from 'discord.js';

class MessageLog {
    /* NOTE - AS OF NOW THIS ARRAY IS GLOBAL ACROSS ALL SERVERS THE BOT IS IN.
     FIGURE OUT SOME WAY TO GET AROUND THAT (punt it into a database, maybe)
     Restore messages only displays messages from the current channel,
     however, memory size could be a problem if lots of deleted messages */
    private static _messageLog: DiscordMessage[] = [];
    // private static _messageLog: any = {ServerID: []};

    static addDeleted(message: DiscordMessage) {
        // Basically here to access the private messagelog
        message.deleted && MessageLog._messageLog.push(message);
    }

    static clearLog(toBeCleared: DiscordMessage[]): DiscordMessage[] {
        // Removes the messages in the params from the message log global
        let messageIds = new Set(toBeCleared.map(message => message.id));
        return MessageLog._messageLog.filter(message => !messageIds.has(message.id));
    }

    static restoreMessages(message: DiscordMessage): SendMsgEmbed {
        // Removes up to 25 logged messages from the current channel and displays them in an embed
        // Note that this will not affect messages sent/deleted while the bot was offline.
        let log: DiscordMessage[] = MessageLog._messageLog.filter(
            loggedMessages => message.channel === loggedMessages.channel,
        );
        let toBeRestored: number = Math.min(log.length, 25);
        log = log.splice(0, toBeRestored);
        MessageLog._messageLog = MessageLog.clearLog(log);
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
