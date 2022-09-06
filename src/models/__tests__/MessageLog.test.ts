import { addDeleted, clearLog, restoreMessages } from '../MessageLog';

let date = new Date(2019, 0);
beforeEach(async () => {
  await Promise.all([clearLog('blah'), clearLog('blah2')]);
});

test('it should have 0 fields for no deleted messages', async () => {
  let response: any = await restoreMessages(makeMessage(6));
  expect(response).toHaveProperty('embed');
  expect(response.embed).toHaveProperty('title', 'Message Log');
  expect(response.embed).toHaveProperty('color');
  expect(response.embed).toHaveProperty('timestamp');
  expect(response.embed).toHaveProperty('description', '0 recently deleted messages');
  expect(response.embed).toHaveProperty('fields');
  expect(response.embed.fields.length).toBe(0);
});

test('It should restore messages that were deleted', async () => {
  await Promise.all([
    addDeleted(makeMessage(1)),
    addDeleted(makeMessage(2)),
    addDeleted(makeMessage(3)),
    addDeleted(makeMessage(4)),
    addDeleted(makeMessage(5)),
    addDeleted(makeMessage(7, 'blah2')),
  ]);

  let response = await restoreMessages(makeMessage(6));
  expect(response).toHaveProperty('embed');
  expect(response.embeds[0].data).toHaveProperty('title', 'Message Log');
  expect(response.embeds[0].data).toHaveProperty('color');
  expect(response.embeds[0].data).toHaveProperty('timestamp');
  expect(response.embeds[0].data).toHaveProperty('description', '5 recently deleted messages');
  expect(response.embeds[0].data).toHaveProperty('fields');
  expect(response.embeds[0].data.fields!.length).toBe(5);
  expect(response.embeds[0].data.fields![0]).toHaveProperty('name', `another blah#1323 - ${date.toDateString()}`);
  expect(response.embeds[0].data.fields![0]).toHaveProperty('value', 'blegh');
});

function makeMessage(id: any, channel?: string): any {
  return {
    id,
    channel: { id: `${channel || 'blah'}` },
    guild: { id: 'test' },
    createdAt: date,
    content: 'blegh',
    deleted: true,
    author: { username: 'another blah', tag: 'another blah#1323', id: 'more blah', discriminator: 'phrasing' },
  };
}
