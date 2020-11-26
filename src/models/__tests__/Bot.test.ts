// import Bot from '../Bot';
// import { returnTestCase } from '../../helpers/testHelpers';

// test('Bot help', async () => {
//   let helpResponse: any = await Bot.commandCenter(returnTestCase('help'));
//   expect(helpResponse).toHaveProperty('embed');
//   expect(helpResponse.embed).toHaveProperty('title', '**Available Commands**');
//   expect(helpResponse.embed).toHaveProperty('color');
//   expect(helpResponse.embed).toHaveProperty('timestamp');
//   expect(helpResponse.embed).toHaveProperty('fields');
//   expect(helpResponse.embed.fields.length).toBeGreaterThanOrEqual(1);
// });
// test('Bot help for submenus', async () => {
//   let helpResponse: any = await Bot.commandCenter(returnTestCase('anime help'));
//   expect(helpResponse).toHaveProperty('embed');
//   expect(helpResponse.embed).toHaveProperty('title', '**Available Commands**');
//   expect(helpResponse.embed).toHaveProperty('color');
//   expect(helpResponse.embed).toHaveProperty('timestamp');
//   expect(helpResponse.embed).toHaveProperty('fields');
//   expect(helpResponse.embed.fields.length).toBeGreaterThanOrEqual(1);
// });
