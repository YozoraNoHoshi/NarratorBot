export default function randomChoice(list: any[]): any {
    let random = Math.floor(Math.random() * list.length);
    return list[random];
}
