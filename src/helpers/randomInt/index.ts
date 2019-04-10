export default function randomInt(min: number, max?: number): number {
    //The maximum is exclusive and the minimum is inclusive
    if (max) {
        min = Math.ceil(min);
        max = Math.floor(max);
    } else {
        max = Math.ceil(min);
        min = 0;
    }
    return Math.floor(Math.random() * (max - min)) + min;
}
