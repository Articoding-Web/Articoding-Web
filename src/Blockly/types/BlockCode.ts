export type BlockCode = {
    blockId: string,
    eventName: string,
    data: Record<string,object>,
    times?: number
}