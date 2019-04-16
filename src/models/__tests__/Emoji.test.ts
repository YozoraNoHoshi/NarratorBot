import Emoji from '../Emoji';
import db from '../../db';
import createError from '../../helpers/createError';
import { returnTestCase } from './testHelpers';

beforeAll(async () => {
    await db.query('DROP TABLE emojis');
    await db.query(`CREATE TABLE emojis (name text PRIMARY KEY, image text NOT NULL);`);
});

beforeEach(async () => {
    await db.query(`INSERT INTO emojis (name, image) VALUES ($1, $2)`, [
        'blobderpy',
        'https://cdn.discordapp.com/emojis/562515136976388107.png',
    ]);
});

test('it should return an emoji url', async () => {
    let result = await Emoji.emoji('blobderpy');
    expect(result).toBe('https://cdn.discordapp.com/emojis/562515136976388107.png');
});

test('it should throw an error if name isnt found', async () => {
    let error;
    try {
        await Emoji.emoji('blobcry');
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(createError(`Could not find emoji blobcry. Check to see if you spelled it correctly`, 404));
});

test('it should return an emoji url', async () => {
    let result = await Emoji.emoji('blobderpy');
    expect(result).toBe('https://cdn.discordapp.com/emojis/562515136976388107.png');
});

test('it should add an emoji', async () => {
    let result = await Emoji.addEmoji(
        returnTestCase('blobstare https://cdn.discordapp.com/emojis/562515153661198404.png'),
    );
    expect(result).toBe('`Added the blobstare emoji.`');
    let query = await db.query(`SELECT * FROM emojis WHERE name = $1`, ['blobstare']);
    expect(query.rows).toHaveProperty('length', 1);
    expect(query.rows[0]).toEqual({
        name: 'blobstare',
        image: 'https://cdn.discordapp.com/emojis/562515153661198404.png',
    });
});

test('it should update an existing emoji link', async () => {
    await Emoji.addEmoji(returnTestCase('blobstare https://cdn.discordapp.com/emojis/562515153661198404.png'));
    let result = await Emoji.addEmoji(
        returnTestCase('blobstare https://cdn.discordapp.com/emojis/325854864888299533.png'),
    );
    expect(result).toBe('`Updated the blobstare emoji.`');
    let query = await db.query(`SELECT * FROM emojis WHERE name = $1`, ['blobstare']);
    expect(query.rows).toHaveProperty('length', 1);
    expect(query.rows[0]).toEqual({
        name: 'blobstare',
        image: 'https://cdn.discordapp.com/emojis/325854864888299533.png',
    });
});

test('it should delete an emoji', async () => {
    let result = await Emoji.deleteEmoji(returnTestCase('blobderpy'));
    expect(result).toBe(`\`Deleted emoji blobderpy\``);
    let query = await db.query('SELECT * FROM emojis');
    expect(query.rows).toHaveProperty('length', 0);
});

test('it should throw an error deleting an emoji that doesnt exist', async () => {
    let error;
    try {
        await Emoji.deleteEmoji(returnTestCase('blobcry'));
    } catch (e) {
        error = e;
    }
    expect(error).toEqual(createError(`Could not find emoji named blobcry.`, 404));
});

afterEach(async () => {
    await db.query('DELETE FROM emojis');
});
