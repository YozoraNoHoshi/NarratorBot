// Either a function or another MethodMap which indicates a submenu
export type BotCommand = (arg0: string, arg1?: any) => any | MethodMap;

export type MethodMap = { [name: string]: BotCommand };
export type helpShape = {
    [name: string]: string;
};
export type SquaredMap = { [name: string]: MethodMap };
