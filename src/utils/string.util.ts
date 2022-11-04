export class StringUtil {
    static generate(data: string) {
        const encodeBuffer = Buffer.from(data)
        return encodeBuffer.toString('base64');
    }
}