export default function randomInt(min: number, max?: number): number {
    //The maximum is exclusive and the minimum is inclusive
    max = max ? Math.floor(max) : Math.ceil(min);
    min = max ? Math.ceil(min) : 0;
    return Math.floor(Math.random() * (max - min)) + min;
}
