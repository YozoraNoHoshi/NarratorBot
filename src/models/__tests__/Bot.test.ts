import Bot from '../Bot';

test('Bot help', async () => {
    let helpResponse: any = await Bot.commandCenter({ noPrefix: `help` });
    expect(helpResponse).toHaveProperty('embed');
    expect(helpResponse.embed).toHaveProperty('title', '**Available Commands**');
    expect(helpResponse.embed).toHaveProperty('color');
    expect(helpResponse.embed).toHaveProperty('timestamp');
    expect(helpResponse.embed).toHaveProperty('fields');
    expect(helpResponse.embed.fields.length).toBeGreaterThanOrEqual(1);
});
