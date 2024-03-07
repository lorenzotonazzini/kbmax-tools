import { ReferencedResource } from "./Resources";

export default interface QuoteHeader {
    references: ReferencedResource[],
    id: number
}