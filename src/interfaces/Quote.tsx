
export interface Log {
    id: number,
    message: string
}

export interface Quote{
    id: number,
    state?: string,
    idWorkflow?: number,
    logs: Log[]
}