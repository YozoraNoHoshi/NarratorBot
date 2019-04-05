// Either a function or another MethodMap which indicates a submenu
export type BotCommand = (arg0: string, arg1?: any) => any | MethodMap;

export type MethodMap = { [name: string]: BotCommand };
export type helpShape = {
    [name: string]: string;
};
export type SquaredMap = { [name: string]: MethodMap };

export type SendMsgEmbed = { embed: DiscordEmbed };

// For use with Discord.js's Embed class
export type DiscordEmbed = {
    author?: object;
    color?: string | number;
    description?: string;
    fields?: object[];
    file?: any;
    files?: any[];
    footer?: object;
    image?: object;
    thumbnail?: object;
    timestamp?: any;
    title?: string;
    url?: string;
};
