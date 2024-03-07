import { ReferencedResource } from "./Resources";


export interface SafeFunction {
    id: number,
    references: ReferencedResource[],
}