import { ReferencedResource } from "./Resources";

export interface Scene {
    id: number,
    graph: any,
    references: ReferencedResource[],
}