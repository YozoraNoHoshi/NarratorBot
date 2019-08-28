import Emoji from '../Emoji';
import db from '../../db';
import createError from '../../helpers/createError';
import { returnTestCase } from '../../helpers/testHelpers';

beforeAll(async () => {
  const mongo = await db;
  await mongo.collection('emojis').deleteMany({});
});

beforeEach(async () => {
  const mongo = await db;
  const col = mongo.collection('emojis');

  await col.insertOne({ name: 'blobderpy', image: 'https://cdn.discordapp.com/emojis/562515136976388107.png' });
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

test('it should add an emoji', async () => {
  let result = await Emoji.addEmoji(
    returnTestCase('blobstare https://cdn.discordapp.com/emojis/562515153661198404.png'),
  );
  expect(result).toBe('`Added the blobstare emoji.`');

  const mongo = await db;
  const col = mongo.collection('emojis');

  let query = await col.find({ name: 'blobstare' }).toArray();
  expect(query).toHaveProperty('length', 1);
  expect(query[0]).toHaveProperty('name', 'blobstare');
  expect(query[0]).toHaveProperty('image', 'https://cdn.discordapp.com/emojis/562515153661198404.png');
});

test('it should update an existing emoji link', async () => {
  await Emoji.addEmoji(returnTestCase('blobstare https://cdn.discordapp.com/emojis/562515153661198404.png'));
  let result = await Emoji.addEmoji(
    returnTestCase('blobstare https://cdn.discordapp.com/emojis/325854864888299533.png'),
  );
  expect(result).toBe('`Updated the blobstare emoji.`');

  const mongo = await db;
  const col = mongo.collection('emojis');

  let query = await col.find({ name: 'blobstare' }).toArray();

  expect(query).toHaveProperty('length', 1);
  expect(query[0]).toHaveProperty('name', 'blobstare');
  expect(query[0]).toHaveProperty('image', 'https://cdn.discordapp.com/emojis/325854864888299533.png');
});

test('it should delete an emoji', async () => {
  await Emoji.addEmoji(
    returnTestCase('blobpat https://cdn.discordapp.com/emojis/325854864888299533.png'),
  );
  
  let result = await Emoji.deleteEmoji(returnTestCase('blobpat'));
  expect(result).toBe(`\`Deleted emoji blobpat\``);

  const mongo = await db;
  const col = mongo.collection('emojis');

  let query = await col.find({ name: 'blobpat' }).toArray();
  expect(query).toHaveProperty('length', 0);
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
  const mongo = await db;
  const col = mongo.collection('emojis');
  col.deleteMany({});
});
