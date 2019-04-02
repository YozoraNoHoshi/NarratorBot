import { EIGHT_BALL_RESPONSES } from './responses';
type MethodMap = { [name: string]: (arg0: any) => void };

class Bot {
    // maps the triggering command to the method
    // commands are in the form <Prefix>[key]
    private static methodMap: MethodMap = {
        flip: Bot.flip,
        roll: Bot.dieRoll,
        '8': Bot.eightBall,
    };

    static commandCenter(message: any): string | void {
        let messageParts: string[] = message.content
            .trim()
            .slice(1)
            .split(' ');

        if (Bot.methodMap.hasOwnProperty(messageParts[0])) {
            let action: any = Bot.methodMap[messageParts[0]];
            // calls method with first argument containing the rest of the message
            // >8 what is life? -> action('what is life?')
            return action(messageParts.slice(1).join(' '));
        } else return;
    }

    private static eightBall(message: string): string {
        if (!message.endsWith('?')) return "That doesn't look like a question.";

        let random = Math.floor(Math.random() * EIGHT_BALL_RESPONSES.length);
        return EIGHT_BALL_RESPONSES[random];
    }

    private static flip(): string {
        return Math.random() < 0.5 ? 'Tails!' : 'Heads!';
    }

    private static dieRoll(sides: string = '6'): string {
        let input: number = Number(sides);
        if (isNaN(input)) return `You can't roll a ${sides}-sided die!`;

        let result = Math.ceil(Math.random() * input);
        return `You rolled a ${result}!`;
    }
}

export default Bot;
