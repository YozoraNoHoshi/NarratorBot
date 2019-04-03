// Magic 8 Ball responses
export const EIGHT_BALL_RESPONSES: string[] = [
    'It is certain.',
    'It is decidedly so.',
    'Without a doubt.',
    'Yes - definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'Outlook good.',
    'Yes.',
    'Signs point to yes.',
    'Reply hazy, try again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it",
    'My reply is no.',
    'My sources say no.',
    'Outlook not so good.',
    'Very doubtful.',
];

// Outcomes for flipping a coin
export const FLIP_RESPONSES: string[] = ['Heads!', 'Tails!'];

type helpShape = {
    [name: string]: string;
};

// responses for the !help command
export const HELP_RESPONSES: helpShape = {
    help: 'You just called this command.',
    emoji: 'Displays the list of all emojis in the store.',
    add: 'Adds an emoji to the global emoji store, or updates the link if it exists. Syntax: <emoji name> <emoji link>',
    delete: 'Deletes an emoji from the emoji store. Syntax: <emoji name>',
    flip: 'Flips a coin.',
    '8': 'Asks the magic 8 ball a question. Questions must end in "?"',
    roll: 'Rolls a X sided die. Default 6. A second parameter can be added to specify the number of sides.',
};
