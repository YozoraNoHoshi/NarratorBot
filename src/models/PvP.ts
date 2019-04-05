import { DiscordMessage, DiscordEmbed, SendMsgEmbed, player } from '../types';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import randomChoice from '../helpers/randomChoice';
import client from '../client';

class PvP {
    private static duelActions: string[] = ['smacks $1 on the head', 'throws a rock at $1'];

    static duel(message: DiscordMessage): SendMsgEmbed {
        // initiates a duel between two users, the sender of the message + the first user mentioned in the message.
        let player1: any = message.author;
        let player2: any = message.mentions.users.first();
        if (!player2) throw createError('You must duel against someone!', 400);
        // Dueling the bot is rigged, player will always lose by the slimmest of margins... or get absolutely slaughtered.
        // if (player2 === client.user) return PvP.duelBot();

        // Starting HP is specified in command or defaults to 30.
        let startHP: string = message.noPrefix.split(' ').find((val: any) => !isNaN(val)) || '30';
        let embed = PvP.duelRound(
            {
                player1: { username: fMessage(player1.username, ITALICS), hp: +startHP },
                player2: { username: fMessage(player2.username, ITALICS), hp: +startHP },
            },
            new RichEmbed()
                .setTitle(
                    fMessage(
                        `Duel between ${fMessage(player1.username, ITALICS)} and ${fMessage(
                            player2.username,
                            ITALICS,
                        )}`,
                        BOLD,
                    ),
                )
                .setColor('#D2691E')
                .setTimestamp(),
            false,
        );
        return { embed };
    }

    private static duelRound(players: { player1: player; player2: player }, embed: any, p2Turn: boolean): DiscordEmbed {
        // base case, prints result on the top
        if (players.player1.hp <= 0 || players.player2.hp <= 0 || embed.fields.length >= 24) {
            return embed.setDescription(
                `Result of Today's Battle: ${PvP.dispHP(players.player1)} - ${PvP.dispHP(players.player2)}`,
            );
        }
        let currPlayer: player = p2Turn ? players.player2 : players.player1;
        let otherPlayer: player = p2Turn ? players.player1 : players.player2;

        // Calculations
        let { action, damage } = PvP.action(otherPlayer.username);
        otherPlayer.hp -= damage;
        let combatLog: string = `${action} for ${damage} damage. ${otherPlayer.username} has ${
            otherPlayer.hp
        } hp left.`;

        // Adds a combat log entry to the embed
        embed.addField(`${PvP.dispHP(currPlayer)}`, combatLog);
        // If player dies, add a result field.
        if (otherPlayer.hp <= 0) embed.addField(`${PvP.dispHP(otherPlayer)}`, `${currPlayer.username}'s victory.`);
        // Go again
        return PvP.duelRound(players, embed, !p2Turn);
    }

    // Reduces disgusting interpolated strings everywhere
    private static dispHP(player: { username: string; hp: number }): string {
        return `${player.username} (${player.hp})`;
    }

    // Returns an arbitrary string and the damage it inflicted.
    private static action(name: string): { action: string; damage: number } {
        // Damage formula will be improved later to a weighted roll
        let damage = Math.floor(Math.random() * 10);
        let action = randomChoice(PvP.duelActions).replace('$1', name);
        return { action, damage };
    }
}

export default PvP;
