
export enum ProductResouceType {
    Product = "Product",
    Scene = "Scene",
    Table = "Table"
}

export interface ProductReferencedResource {
    id: number,
    type: ProductResouceType
}

export default interface Product {
    references: ProductReferencedResource[],
    id: number
}