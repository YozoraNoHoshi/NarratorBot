import { DiscordMessage, DiscordEmbed, SendMsgEmbed, player } from '../types';
import createError from '../helpers/createError';
import { RichEmbed } from 'discord.js';
import fMessage, { BOLD, ITALICS } from '../helpers/fMessage';
import randomChoice from '../helpers/randomChoice';

class PvP {
    static duel(message: DiscordMessage): SendMsgEmbed {
        // initiates a duel between two users, the sender of the message + the first user mentioned in the message.
        let player1: any = message.author;
        let player2: any = message.mentions.users.first();
        if (!player2) throw createError('You must duel against someone!', 400);
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
        // let duel = PvP.duelRound(+startHP, +startHP, embed);
        // Calls the duel function
        // returns the victor
        return { embed };
    }

    private static duelRound(players: { player1: player; player2: player }, embed: any, p2Turn: boolean): DiscordEmbed {
        if (players.player1.hp <= 0 || players.player2.hp <= 0 || embed.fields.length >= 24) {
            return embed.setDescription(
                `Result of Today's Battle: ${PvP.dispHP(players.player1)} - ${PvP.dispHP(players.player2)}`,
            );
        }
        let currPlayer: player = p2Turn ? players.player2 : players.player1;
        let otherPlayer: player = p2Turn ? players.player1 : players.player2;
        let { action, damage } = PvP.action(otherPlayer.username);
        otherPlayer.hp -= damage;
        let combatLog: string = `${action} for ${damage} damage. ${otherPlayer.username} has ${otherPlayer.hp} left.`;
        embed.addField(`${PvP.dispHP(currPlayer)}`, combatLog);
        if (otherPlayer.hp <= 0) embed.addField(`${PvP.dispHP(currPlayer)}`, `${currPlayer.username}'s victory.`);
        return PvP.duelRound(players, embed, !p2Turn);
    }

    private static dispHP(player: { username: string; hp: number }): string {
        return `${player.username}(${player.hp}`;
    }

    private static action(name: string): { action: string; damage: number } {
        let damage = Math.floor(Math.random() * 10);
        let action = randomChoice(PvP.duelActions).replace('$1', name);
        return { action, damage };
    }

    private static duelActions: string[] = ['smacks $1 on the head', 'throws a rock at $1'];
}

export default PvP;
