import { ProductReferencedResource } from "./Product";

export interface Scene {
    id: number,
    graph: any,
    references: ProductReferencedResource[],
}