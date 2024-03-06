interface ReferencedProduct {
    id: number,
    type: string
}
export default interface Product {
    references: ReferencedProduct[],
    id: number
}