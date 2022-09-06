export default function randomChoice<T>(list: T[]): T {
  let random: number = Math.floor(Math.random() * list.length);
  return list[random];
}
