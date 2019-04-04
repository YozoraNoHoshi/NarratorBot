export const SPOILER = 'spoiler';
export const BOLD = 'bold';
export const ITALICS = 'italics';
export const UNDERLINE = 'underline';
export const STRIKETHROUGH = 'strikethrough';
export const INLINE = 'inline';
export const BLOCK = 'block';

/**
 * Formats an outgoing Discord message with the specified styles.
 * @param message The message to be formatted
 * @param options args of any Discord-compatible formatting
 * @returns the formatted message
 */
export default function fMessage(message: string, ...options: string[]): string {
    let formattedMessage: string = message;
    let blockFormatting: string = '';
    for (let style of options) {
        if (style === BLOCK) {
            blockFormatting = BLOCK;
        } else if (style === INLINE && blockFormatting !== BLOCK) {
            blockFormatting = INLINE;
        } else if (styles.hasOwnProperty(style) && style !== INLINE) {
            formattedMessage = `${styles[style]}${formattedMessage}${styles[style]}`;
        }
    }
    if (blockFormatting !== '') {
        formattedMessage = `${styles[blockFormatting]}${formattedMessage}${styles[blockFormatting]}`;
    }

    return formattedMessage;
}
const styles: { [name: string]: string } = {
    spoiler: '||',
    bold: '**',
    italics: '*',
    underline: '__',
    strikethrough: '~~',
    inline: '`',
    block: '```',
};
// syntax highlighting can be any sort of coding language and should go after a block
