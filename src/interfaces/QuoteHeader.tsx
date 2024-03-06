import { ProductReferencedResource } from "./Product";

export default interface QuoteHeader {
    references: ProductReferencedResource[],
    id: number
}