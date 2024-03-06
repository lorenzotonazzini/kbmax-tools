import { ProductReferencedResource } from "./Product";

export interface SafeFunction {
    id: number,
    references: ProductReferencedResource[],
}