export default function extractDate(date: Date): string {
    let copyDate: Date = new Date(date.getTime());
    let hours: number = copyDate.getHours();
    let format: string = hours > 11 ? 'PM' : 'AM';
    if (hours > 11) copyDate.setHours(hours - 12);

    return `${copyDate.toTimeString().split(' ')[0]} ${format}`;
}
