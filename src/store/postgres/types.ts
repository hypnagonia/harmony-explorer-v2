export type Query = (sql: string, params: any[], retries?: number) => Promise<any>
