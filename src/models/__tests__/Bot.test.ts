import Bot from '../Bot';
import { Message } from 'discord.js';

test('Bot help', async () => {
    let message: any = { noPrefix: `help` };
    let helpResponse: any = await Bot.commandCenter(message);
    expect(helpResponse).toHaveProperty('embed');
    expect(helpResponse.embed).toHaveProperty('title', '**Available Commands**');
    expect(helpResponse.embed).toHaveProperty('color');
    expect(helpResponse.embed).toHaveProperty('timestamp');
    expect(helpResponse.embed).toHaveProperty('fields');
    expect(helpResponse.embed.fields.length).toBeGreaterThanOrEqual(1);
});
