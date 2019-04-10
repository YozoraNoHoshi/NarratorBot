import PvP from '../PvP';
import fMessage, { ITALICS, BOLD } from '../../helpers/fMessage';
import { Collection } from 'discord.js';

test('PvP duels against a non bot', async () => {
    // Test the pvp class for stuff
    let user = 'user';
    let users: any = [
        { 0: 'a', 1: { username: `${user}1`, bot: true, id: 'a' } },
        { 0: 'b', 1: { username: `${user}2`, bot: false, id: 'b' } },
    ];
    let userCollection = new Collection(users);
    let response = PvP.duel(makeMessage(user, userCollection));
    let title = `${fMessage(
        `Duel between ${fMessage(user, ITALICS)} and ${fMessage(users[1][1].username, ITALICS)}`,
        BOLD,
    )}`;
    expect(response).toHaveProperty('embed');
    expect(response.embed).toHaveProperty('title', title);
    expect(response.embed).toHaveProperty('color');
    expect(response.embed).toHaveProperty('timestamp');
    expect(response.embed).toHaveProperty('description');
    expect(response.embed).toHaveProperty('fields');
});
test('PvP duel throws error if no valid mentions', async () => {
    // Test the pvp class for stuff
    let user = 'user';
    let users: any = [
        { 0: 'a', 1: { username: `${user}1`, bot: true, id: 'a' } },
        { 0: 'b', 1: { username: `${user}2`, bot: true, id: 'b' } },
    ];
    let userCollection = new Collection(users);
    expect(() => {
        PvP.duel(makeMessage(user, userCollection));
    }).toThrow('You must duel against someone!');
});
function makeMessage(username: any, users: any, noPrefix?: string): any {
    return {
        noPrefix: noPrefix || '',
        deleted: true,
        author: { username },
        mentions: { users },
    };
}
