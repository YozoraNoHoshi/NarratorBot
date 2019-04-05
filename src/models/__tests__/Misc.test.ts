import { EIGHT_BALL_RESPONSES } from '../../responses';
import Misc from '../Misc';

test('Bot flip', () => {
    expect(Misc.flip()).toContain("Result of today's flip");
});
test('Bot 8ball', () => {
    expect(EIGHT_BALL_RESPONSES).toContain(Misc.eightBall({ noPrefix: 'What is life?' }));
    expect(Misc.eightBall({ noPrefix: `what is life` })).toBe("That doesn't look like a question.");
});
test('Bot die roll', () => {
    expect(Misc.dieRoll({ noPrefix: '' })).toContain('You rolled a');
    expect(Misc.dieRoll({ noPrefix: '-1' })).toBe('Maybe try something higher than -1?');
    expect(Misc.dieRoll({ noPrefix: 'Infinity' })).toBe('No.');
});
