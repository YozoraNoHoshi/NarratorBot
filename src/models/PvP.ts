import { DiscordMessage, DiscordEmbed, SendMsgEmbed, player } from '../types';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import randomChoice from '../helpers/randomChoice';
import client from '../client';
import randomInt from '../helpers/randomInt';

class PvP {
    // Available pool of messages to draw from. Can be altered/added/deleted to whatever.
    private static duelActions: string[] = ['smacks $1 on the head', 'throws a rock at $1'];
    private static deathMessages: string[] = ['ran out of health and died'];

    static duel(message: DiscordMessage): SendMsgEmbed {
        // initiates a duel between two users, the sender of the message + the first user mentioned in the message.
        let player1: any = message.author;
        // Cannot duel bots except this one.
        let player2: any = message.mentions.users.filter((user: any) => user === client.user || !user.bot).first();
        if (!player2) throw createError('You must duel against someone!', 400);
        // Dueling the bot is rigged, player will always lose by the slimmest of margins... or get absolutely slaughtered.

        // Starting HP is specified in command or defaults to 30.
        let startHP: string = message.noPrefix.split(' ').find((val: any) => !isNaN(val)) || '30';
        let title: string = `Duel between ${fMessage(player1.username, ITALICS)} and ${fMessage(
            player2.username,
            ITALICS,
        )}`;
        // Initial settings for the duel, randomizes who goes first
        let embed = PvP.duelRound(
            {
                player1: { username: fMessage(player1.username, ITALICS), hp: +startHP },
                player2: {
                    username: fMessage(player2.username, ITALICS),
                    hp: player2 === client.user ? 9999 : +startHP,
                },
            },
            new RichEmbed()
                .setTitle(fMessage(title, BOLD))
                .setColor('#D2691E')
                .setTimestamp(),
            0.5 < Math.random(),
            player2 === client.user,
        );

        return { embed };
    }

    private static duelRound(
        players: { player1: player; player2: player },
        embed: any,
        p2Turn: boolean,
        bot: boolean,
    ): DiscordEmbed {
        // base case, prints result on the top
        if (players.player1.hp <= 0 || players.player2.hp <= 0 || embed.fields.length >= 24) {
            return embed.setDescription(
                `Result of Today's Battle: ${PvP.dispHP(players.player1)} - ${PvP.dispHP(players.player2)}`,
            );
        }
        let currPlayer: player = p2Turn ? players.player2 : players.player1;
        let otherPlayer: player = p2Turn ? players.player1 : players.player2;

        // Calculations
        let { action, damage } = PvP.action(otherPlayer.username, bot && p2Turn);
        otherPlayer.hp -= damage;
        let combatLog: string = `${action} for ${damage} damage.`;

        // Adds a combat log entry to the embed
        embed.addField(`${PvP.dispHP(currPlayer)}`, combatLog);
        // If player dies, add a result field.
        if (otherPlayer.hp <= 0)
            embed.addField(
                `${PvP.dispHP(otherPlayer)}`,
                `${PvP.deathMessage(otherPlayer.username)}. ${currPlayer.username}'s victory.`,
            );
        // Go again
        return PvP.duelRound(players, embed, !p2Turn, bot);
    }

    // Reduces disgusting interpolated strings everywhere
    private static dispHP(player: { username: string; hp: number }): string {
        return `${player.username} (${player.hp})`;
    }

    // Returns an arbitrary string and the damage it inflicted.
    private static action(name: string, bot: boolean): { action: string; damage: number } {
        // Damage formula will be improved later to a weighted roll
        let damage = bot ? 9999 : randomInt(10);
        let action = randomChoice(PvP.duelActions).replace('$1', name);
        return { action, damage };
    }

    private static deathMessage(name: string): string {
        return randomChoice(PvP.deathMessages).replace('$1', name);
    }
}

export default PvP;
