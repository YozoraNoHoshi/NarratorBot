export default function createError(message: string, statusCode: number): any {
    let newError: any = new Error(message);
    newError.status = statusCode || 500;
    return newError;
}
