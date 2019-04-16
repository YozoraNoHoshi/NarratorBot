import reactionFromUser from '.';
import { Collection } from 'discord.js';

test('it should return the first reaction a user has made', () => {
    let userData: any = [
        { 0: 'a', 1: { username: `a`, bot: true, id: 'a' } },
        { 0: 'b', 1: { username: `b`, bot: false, id: 'b' } },
    ];
    let users = new Collection(userData);
    let reactionData: any = [{ 0: 'reaction', 1: { users } }];
    let collection: any = new Collection(reactionData);
    let user: any = { id: 'a' };
    let result = reactionFromUser(collection, user);
    expect(result).toEqual({ users });
});
