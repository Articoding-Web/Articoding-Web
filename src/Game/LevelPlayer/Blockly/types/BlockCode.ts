export type BlockCode = {
    blockId: string,
    eventName: string,
    data: Record<string,object>,
    times?: number
}

export function stringifyBlockCode(code: BlockCode): string {
    const { eventName, data, times } = code;
    let resultString = `eventName: ${eventName}, data: ${JSON.stringify(data)}`;
    if (times !== undefined) {
        resultString += `, times: ${times}`;
    }
    return resultString;
}