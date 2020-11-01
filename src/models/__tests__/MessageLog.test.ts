// let date = new Date(2019, 0);

// test('it should have 0 fields for no deleted messages', async () => {
//     let response: any = MessageLog.restoreMessages(makeMessage(6));
//     expect(response).toHaveProperty('embed');
//     expect(response.embed).toHaveProperty('title', 'Message Log');
//     expect(response.embed).toHaveProperty('color');
//     expect(response.embed).toHaveProperty('timestamp');
//     expect(response.embed).toHaveProperty('description', '0 recently deleted messages');
//     expect(response.embed).toHaveProperty('fields');
//     expect(response.embed.fields.length).toBe(0);
// });

// test('It should restore messages that were deleted', async () => {
//     MessageLog.addDeleted(makeMessage(1));
//     MessageLog.addDeleted(makeMessage(2));
//     MessageLog.addDeleted(makeMessage(3));
//     MessageLog.addDeleted(makeMessage(4));
//     MessageLog.addDeleted(makeMessage(5));
//     MessageLog.addDeleted(makeMessage(7, 'asdasdasdas'));

//     let response: any = MessageLog.restoreMessages(makeMessage(6));
//     expect(response).toHaveProperty('embed');
//     expect(response.embed).toHaveProperty('title', 'Message Log');
//     expect(response.embed).toHaveProperty('color');
//     expect(response.embed).toHaveProperty('timestamp');
//     expect(response.embed).toHaveProperty('description', '5 recently deleted messages');
//     expect(response.embed).toHaveProperty('fields');
//     expect(response.embed.fields.length).toBe(5);
//     expect(response.embed.fields[0]).toHaveProperty('name', `another blah#1323 - ${date.toDateString()}`);
//     expect(response.embed.fields[0]).toHaveProperty('value', 'blegh');
// });

// function makeMessage(id: any, channel?: string): any {
//     return {
//         id,
//         channel: `${channel || 'blah'}`,
//         createdAt: date,
//         content: 'blegh',
//         deleted: true,
//         author: { username: 'another blah', tag: 'another blah#1323' },
//     };
// }
