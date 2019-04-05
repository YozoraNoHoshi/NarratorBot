import Bot from '../Bot';

test('Bot help', async () => {
    expect(await Bot.commandCenter({ noPrefix: `help` })).toHaveProperty('embed');
});
