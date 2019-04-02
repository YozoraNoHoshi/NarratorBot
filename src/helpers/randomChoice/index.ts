export default function randomChoice(list: any[]): any {
    let random: number = Math.floor(Math.random() * list.length);
    return list[random];
}
