export default function randomInt(num: number, up: boolean = false) {
    return up ? Math.ceil(Math.random() * num) : Math.floor(Math.random() * num);
}
