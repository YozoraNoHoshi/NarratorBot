import { EIGHT_BALL_RESPONSES } from '../../responses';
import Misc from '../Misc';
import fMessage, { BLOCK } from '../../helpers/fMessage';
import { returnTestCase } from './testHelpers';

test('Bot flip', () => {
    expect(Misc.flip()).toContain('flips a coin and...');
});
test('Bot 8ball', () => {
    let possibleResponses: string[] = EIGHT_BALL_RESPONSES.map(r => fMessage(r, BLOCK));
    let response: string = Misc.eightBall(returnTestCase('whatislife?'));
    expect(possibleResponses).toContain(response);
    expect(Misc.eightBall(returnTestCase('whatislife'))).toBe("That doesn't look like a question.");
});
test('Bot die roll', () => {
    expect(Misc.dieRoll(returnTestCase(''))).toContain('You rolled a');
    expect(Misc.dieRoll(returnTestCase('-1'))).toBe('Maybe try something higher than -1?');
    expect(Misc.dieRoll(returnTestCase('Infinity'))).toBe('No.');
});
