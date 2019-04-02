import Bot from './Bot';
import { FLIP_RESPONSES, EIGHT_BALL_RESPONSES } from './responses';
import { BOT_PREFIX } from './config';

test('Bot flip', async () => {
    expect(FLIP_RESPONSES).toContain(await Bot.commandCenter({ content: `${BOT_PREFIX}flip` }));
});
test('Bot 8ball', async () => {
    expect(EIGHT_BALL_RESPONSES).toContain(await Bot.commandCenter({ content: `${BOT_PREFIX}8 what is life?` }));
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}8 what is life` })).toBe(
        "That doesn't look like a question.",
    );
});
test('Bot die roll', async () => {
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}roll blegh` })).toBe("You can't roll a blegh-sided die!");
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}roll` })).toContain('You rolled a');
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}roll -1` })).toBe('Maybe try something higher than -1?');
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}roll Infinity` })).toBe('No.');
});
test('Bot help', async () => {
    expect(await Bot.commandCenter({ content: `${BOT_PREFIX}help` })).toContain('You just called this command.');
});
