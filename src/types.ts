// Either a function or another MethodMap which indicates a submenu
export type MethodMap = { [name: string]: BotCommand };
export type CommandFunction = (arg0: DiscordMessage, arg1?: any) => any;
export type BotCommand = CommandFunction | MethodMap;

export type Player = { username: string; hp: number };
export type SendMsgEmbed = { embed: DiscordEmbed };

export type ResponseMap = {
    [name: string]: string | ResponseMap;
};
export type DiscordMessage = {
    attachments?: any;
    author?: any;
    channel?: any;
    readonly cleanContent?: string;
    readonly client?: any;
    content?: any;
    readonly createdAt?: any;
    createdTimestamp?: any;
    readonly deletable?: boolean;
    deleted?: boolean;
    readonly editable?: boolean;
    readonly editedAt?: any;
    editedTimestamp?: any;
    readonly edits?: any[];
    embeds?: any[];
    readonly guild?: any;
    hit?: boolean;
    id?: any;
    member?: any;
    mentions?: any;
    nonce?: string;
    noPrefix: string;
    readonly pinnable?: boolean;
    pinned?: boolean;
    reactions?: any;
    system?: boolean;
    tts?: boolean;
    type?: any;
    readonly url?: any;
    webhookID?: any;
    [name: string]: any;
};
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
    [name: string]: any;
};
